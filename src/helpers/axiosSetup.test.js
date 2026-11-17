import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getErrorMessage, setUnauthorizedHandler } from "./axiosSetup";

// Exercises the real interceptors installed by axiosSetup on the global axios
describe("axios error normalization", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
    setUnauthorizedHandler(null);
  });

  const failOn = async (request) => {
    try {
      await request();
    } catch (error) {
      return error;
    }
    throw new Error("request was expected to fail");
  };

  test("GET requests ask for JSON and carry the bearer token", async () => {
    localStorage.setItem("authToken", "abc123");
    mock.onGet("api/x").reply((config) => [200, config.headers]);

    const { data } = await axios.get("api/x");

    expect(data.Accept).toBe("application/json");
    expect(data.Authorization).toBe("Bearer abc123");
  });

  test("422 validation errors list every field message", async () => {
    mock.onPost("api/login").reply(422, {
      message: "The username field is required. (and 1 more error)",
      errors: {
        username: ["The username field is required."],
        password: ["The password field is required."],
      },
    });

    const error = await failOn(() => axios.post("api/login", {}));

    expect(error.response.status).toBe(422);
    expect(error.response.data.message).toBe(
      "The username field is required.\nThe password field is required.",
    );
    expect(error.response.data.errors.username).toEqual([
      "The username field is required.",
    ]);
    expect(error.message).toBe(error.response.data.message);
  });

  test("backend { message } is kept as is (e.g. 400 invalid credentials)", async () => {
    mock.onPost("api/login").reply(400, { message: "Invalid Credentials" });

    const error = await failOn(() => axios.post("api/login", {}));

    expect(error.response.status).toBe(400);
    expect(error.response.data.message).toBe("Invalid Credentials");
  });

  test("object message and { error } bodies become readable text", async () => {
    mock.onPost("api/a").reply(500, { message: { name: ["Name is taken."] } });
    mock.onPost("api/b").reply(403, { error: "Account not validated." });

    const a = await failOn(() => axios.post("api/a"));
    const b = await failOn(() => axios.post("api/b"));

    expect(a.response.data.message).toBe("Name is taken.");
    expect(b.response.data.message).toBe("Account not validated.");
  });

  test("IIS HTML error page is replaced by a status message", async () => {
    mock
      .onGet("api/html")
      .reply(400, "<!DOCTYPE html><html><body>Bad Request</body></html>");

    const error = await failOn(() => axios.get("api/html"));

    expect(error.response.status).toBe(400);
    expect(error.response.data.message).toBe(
      "The request could not be processed. Please check your input and try again.",
    );
    expect(error.response.data.message).not.toMatch(/</);
  });

  test("empty bodies fall back to a message for the status", async () => {
    mock.onPost("api/upload").reply(413, "");
    mock.onGet("api/gone").reply(404, {});
    mock.onGet("api/odd").reply(418);

    const upload = await failOn(() => axios.post("api/upload"));
    const gone = await failOn(() => axios.get("api/gone"));
    const odd = await failOn(() => axios.get("api/odd"));

    expect(upload.response.data.message).toMatch(/too large/);
    expect(gone.response.data.message).toMatch(/not found/);
    expect(odd.response.data.message).toMatch(/Something went wrong/);
  });

  test("CORS / network failure gets status 0 and a readable message", async () => {
    mock.onGet("api/down").networkError();

    const error = await failOn(() => axios.get("api/down"));

    // previously error.response was undefined and the interceptor crashed
    expect(error.response.status).toBe(0);
    expect(error.response.data.message).toMatch(/Unable to reach the server/);
  });

  test("timeout gets a timeout message", async () => {
    mock.onGet("api/slow").timeout();

    const error = await failOn(() => axios.get("api/slow"));

    expect(error.response.status).toBe(0);
    expect(error.response.data.message).toMatch(/timed out/);
  });

  test("JSON error inside a blob download is decoded", async () => {
    const blob = new Blob([JSON.stringify({ message: "File not found." })], {
      type: "application/json",
    });
    mock.onGet("api/download").reply(404, blob);

    const error = await failOn(() =>
      axios.get("api/download", { responseType: "blob" }),
    );

    expect(error.response.data.message).toBe("File not found.");
  });

  test("401 calls the unauthorized handler, other errors do not", async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    mock.onGet("api/secure").reply(401, { message: "Unauthenticated." });
    mock.onGet("api/broken").reply(500, { message: "boom" });

    const unauth = await failOn(() => axios.get("api/secure"));
    await failOn(() => axios.get("api/broken"));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(unauth.response.data.message).toBe("Unauthenticated.");
  });

  test("thunk pattern rejectWithValue(error.response.data) always has a message", async () => {
    mock.onPost("api/login").networkError();

    const error = await failOn(() => axios.post("api/login", {}));
    const payload = error.response.data; // what the redux thunks reject with

    expect(typeof payload.message).toBe("string");
    expect(payload.message.length).toBeGreaterThan(0);
  });

  test("getErrorMessage handles plain errors and missing input", () => {
    expect(getErrorMessage(null)).toMatch(/Something went wrong/);
    expect(getErrorMessage(new Error("x"))).toMatch(/Unable to reach/);
    expect(getErrorMessage(undefined, "Custom fallback")).toBe(
      "Custom fallback",
    );
  });
});
