import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Swal from "sweetalert2";
import "helpers/axiosSetup";
import useSubmit from "./useSubmit";
import useDelete from "./useDelete";

jest.mock("sweetalert2", () => ({
  __esModule: true,
  default: { fire: jest.fn(), showLoading: jest.fn() },
}));
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn() }));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

// The error alert is the last Swal.fire call
const lastAlert = () => Swal.fire.mock.calls[Swal.fire.mock.calls.length - 1][0];

describe("error alerts shown to the user", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    Swal.fire.mockReset();
    // confirm dialogs resolve as "Yes"; other dialogs resolve too
    Swal.fire.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
  });

  afterEach(() => mock.restore());

  test("useSubmit shows the backend validation messages and waits for OK", async () => {
    mock.onPost("api/client/special-permit/event").reply(422, {
      message: "The event name field is required.",
      errors: { event_name: ["The event name field is required."] },
    });

    useSubmit()({ url: "api/client/special-permit/event", params: {} });
    await flush();
    await flush();

    const alert = lastAlert();
    expect(alert.icon).toBe("error");
    expect(alert.text).toBe("The event name field is required.");
    expect(alert.timer).toBeUndefined(); // stays until the user clicks OK
  });

  test("useSubmit shows a connection message on CORS / network failure", async () => {
    mock.onPost("api/pay-permit").networkError();

    useSubmit()({ url: "api/pay-permit", params: {} });
    await flush();
    await flush();

    expect(lastAlert().text).toMatch(/Unable to reach the server/);
  });

  test("useSubmit uses the caller's fallback when the server sends no message", async () => {
    mock.onPost("api/admin/upload-permit").reply(500, "");

    useSubmit()({
      url: "api/admin/upload-permit",
      params: {},
      message: { error: "Uploading the permit failed." },
    });
    await flush();
    await flush();

    expect(lastAlert().text).toBe("Uploading the permit failed.");
  });

  test("useDelete shows the backend message", async () => {
    mock
      .onPost("api/admin/delete/exempted-cases")
      .reply(403, { message: "You are not allowed to perform this action." });

    await useDelete()({ url: "api/admin/delete/exempted-cases", params: {} });

    expect(lastAlert().icon).toBe("error");
    expect(lastAlert().text).toBe("You are not allowed to perform this action.");
  });

  test("useDelete falls back on an IIS HTML error page", async () => {
    mock
      .onPost("api/admin/delete/application-purpose")
      .reply(500, "<html><body>500 - Internal server error.</body></html>");

    await useDelete()({ url: "api/admin/delete/application-purpose", params: {} });

    expect(lastAlert().text).toBe("An error occurred while deleting the record.");
  });
});
