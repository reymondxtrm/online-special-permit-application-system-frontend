import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Swal from "sweetalert2";
import "helpers/axiosSetup";
import UserProfile from "./index";

jest.mock("sweetalert2", () => ({
  __esModule: true,
  default: { fire: jest.fn(), showLoading: jest.fn() },
}));
jest.mock("react-redux", () => ({
  useSelector: (selector) =>
    selector({ user: { name: "JUAN", email: "juan@test.local" } }),
  useDispatch: () => (fn) => (typeof fn === "function" ? fn() : fn),
}));
jest.mock("../Modals/ChangePasswordModal", () => () => null);

const profile = {
  fname: "JUAN",
  fullname: "JUAN S DELA CRUZ",
  sex: "MALE",
  account_type: "individual",
  user_details: {
    birthdate: "1990-05-10",
    birthplace: "BUTUAN",
    civil_status_id: 1,
    civil_status: { id: 1, name: "Single" },
    educational_attainment: "SeniorGraduate",
    height: "170",
    weight: "65",
    blood_type: "O+",
    age: 36,
  },
  user_phone_numbers: [{ phone_number: "09170000001", type: null }],
  user_addresses: [
    {
      province: "",
      city: "BUTUAN CITY",
      barangay: "LIBERTAD",
      subdivision: "VILLA",
      address_line: "P-1",
      address_type: "permanent",
    },
  ],
  user_occupation_details: null,
};

const ageOf = (date) => {
  const birth = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

describe("Client profile personal details", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onGet("api/get-civil-status").reply(200, [
      { id: 1, name: "Single" },
      { id: 2, name: "Married" },
    ]);
    Swal.fire.mockReset();
    Swal.fire.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
  });

  afterEach(() => mock.restore());

  test("shows real details instead of the hardcoded education", async () => {
    mock.onGet("api/client/profile").reply(200, profile);
    render(<UserProfile />);

    expect(await screen.findByText("JUAN S DELA CRUZ")).toBeInTheDocument();
    expect(screen.getByText("Senior-High Graduate")).toBeInTheDocument();
    expect(screen.queryByText("College Graduate")).not.toBeInTheDocument();
    expect(screen.getByText("O+")).toBeInTheDocument();
    expect(screen.getByText("Single")).toBeInTheDocument();
    expect(screen.getByText(String(ageOf("1990-05-10")))).toBeInTheDocument();
  });

  test("edit, age preview and saved payload", async () => {
    mock.onGet("api/client/profile").reply(200, profile);
    let sent;
    mock.onPost("api/client/profile/update").reply((config) => {
      sent = JSON.parse(config.data);
      return [200, { message: "Profile updated successfully." }];
    });
    const { container } = render(<UserProfile />);
    fireEvent.click(await screen.findByText("Edit Personal Details"));

    const birthdate = container.querySelector("#birthdate");
    expect(birthdate.value).toBe("1990-05-10");
    expect(container.querySelector("#sex").value).toBe("MALE");
    expect(container.querySelector("#contact_no").value).toBe("09170000001");
    expect(container.querySelector("#barangay").value).toBe("LIBERTAD");
    expect(
      screen.getByText(/To correct your name or email/),
    ).toBeInTheDocument();

    fireEvent.change(birthdate, { target: { value: "2000-02-15" } });
    expect(await screen.findByText(String(ageOf("2000-02-15")))).toBeInTheDocument();
    fireEvent.change(container.querySelector("#civil_status_id"), {
      target: { value: "2" },
    });
    fireEvent.change(container.querySelector("#barangay"), {
      target: { value: "DOONGAN" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(sent).toBeDefined());
    expect(sent).toEqual({
      birthdate: "2000-02-15",
      birthplace: "BUTUAN",
      sex: "MALE",
      civil_status_id: "2",
      educational_attainment: "SeniorGraduate",
      height: "170",
      weight: "65",
      blood_type: "O+",
      contact_no: "09170000001",
      province: "",
      city: "BUTUAN CITY",
      barangay: "DOONGAN",
      subdivision: "VILLA",
      address_line: "P-1",
    });
  });

  test("future birthdate is blocked before sending", async () => {
    mock.onGet("api/client/profile").reply(200, profile);
    const post = jest.fn(() => [200, {}]);
    mock.onPost("api/client/profile/update").reply(post);
    const { container } = render(<UserProfile />);
    fireEvent.click(await screen.findByText("Edit Personal Details"));

    const future = new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .slice(0, 10);
    fireEvent.change(container.querySelector("#birthdate"), {
      target: { value: future },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("Birthday cannot be in the future"),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("backend validation message is shown to the user", async () => {
    mock.onGet("api/client/profile").reply(200, profile);
    mock.onPost("api/client/profile/update").reply(422, {
      message: "This contact number has already been taken.",
      errors: { contact_no: ["This contact number has already been taken."] },
    });
    render(<UserProfile />);
    fireEvent.click(await screen.findByText("Edit Personal Details"));
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenLastCalledWith(
        expect.objectContaining({
          icon: "error",
          text: "This contact number has already been taken.",
        }),
      ),
    );
  });

  test("cancel restores the saved values", async () => {
    mock.onGet("api/client/profile").reply(200, profile);
    const { container } = render(<UserProfile />);
    fireEvent.click(await screen.findByText("Edit Personal Details"));
    fireEvent.change(container.querySelector("#birthplace"), {
      target: { value: "WRONG" },
    });
    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Edit Personal Details"));

    expect(container.querySelector("#birthplace").value).toBe("BUTUAN");
  });

  test("company accounts have no personal edit button", async () => {
    mock
      .onGet("api/client/profile")
      .reply(200, { ...profile, account_type: "company", fname: "ACME INC" });
    render(<UserProfile />);

    expect(await screen.findByText("ACME INC")).toBeInTheDocument();
    expect(screen.queryByText("Edit Personal Details")).not.toBeInTheDocument();
  });

  test("load failure shows the error message", async () => {
    mock.onGet("api/client/profile").networkError();
    render(<UserProfile />);

    expect(
      await screen.findByText(/Unable to reach the server/),
    ).toBeInTheDocument();
  });
});
