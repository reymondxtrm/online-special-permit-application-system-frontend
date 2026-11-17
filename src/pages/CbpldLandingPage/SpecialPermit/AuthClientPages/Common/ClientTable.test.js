/* eslint-disable react/display-name */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ClientTable from "./ClientTable";

let mockState;
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: (selector) => selector(mockState),
  useDispatch: () => mockDispatch,
}));
jest.mock("features/SpecialPermitClient", () => ({
  getClientTableData: (params) => ({ type: "getClientTableData", params }),
  SpecialPermitClientSlice: {
    actions: {
      setProps: (p) => ({ type: "setProps", p }),
      setApplicationIdsForPayment: (ids) => ({ type: "payIds", ids }),
      setDataProps: (p) => ({ type: "setDataProps", p }),
      setShowLoading: (p) => ({ type: "setShowLoading", p }),
    },
  },
}));
jest.mock("sweetalert2", () => ({ __esModule: true, default: { fire: jest.fn() } }));
jest.mock("hooks/Common/useSubmit", () => () => jest.fn());
jest.mock("hooks/Common/useGetImage", () => () => ({
  getImageHandle: jest.fn(),
  currentImage: null,
  isFetching: false,
  fileType: null,
}));
jest.mock("components/Pagination", () => () => null);
jest.mock("react-simple-image-viewer", () => () => null);
jest.mock("./FileIconFormat", () => ({ fileType, path }) => (
  <span data-testid={`file-${fileType}`}>{path}</span>
));
jest.mock("../Modals/PaymentModal", () => ({ applicationId }) => (
  <div data-testid="pay-modal">{JSON.stringify(applicationId)}</div>
));
jest.mock("../Modals/ReuploadModal", () => ({ openModal, applicationId }) =>
  openModal ? (
    <div data-testid="reupload-modal">{JSON.stringify(applicationId)}</div>
  ) : null,
);
jest.mock("pages/CbpldLandingPage/Modals/MayorsCertificateModal", () =>
  ({ specialPermitApplicationId }) => (
    <div data-testid="mayors-modal">{specialPermitApplicationId}</div>
  ),
);
jest.mock("../Modals/ReuploadCedulaModal", () => () => null);
jest.mock("../../AuthAdminPages/Modals/CedulaApplicationFormModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/OccupationalPermitModal", () => () => null);
jest.mock("../../AuthAdminPages/Modals/AttachmentModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/GoodMoralModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/EventModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/MotorcadeModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/ParadeModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/RecorridaModal", () => () => null);
jest.mock("pages/CbpldLandingPage/Modals/UseOfGovernmentPropertyModal", () => () => null);
jest.mock("../../AuthAdminPages/AdminControls/Modals/FileViewerModal2", () => () => null);

const app = (id, code, extra = {}) => ({
  id,
  reference_no: `REF-${id}`,
  special_permit_status: { code, name: code },
  application_purpose: { name: "Employment" },
  uploaded_file: { police_clearance: `pc-${id}.jpg` },
  status_histories: [],
  order_of_payment: null,
  ...extra,
});

const mayorsRows = [
  app(1, "pending"),
  app(2, "for_payment", {
    order_of_payment: { total_amount: 60, payment_on_progress: 0 },
  }),
  app(3, "for_payment_approval", { order_of_payment: { total_amount: 70 } }),
  app(4, "returned", {
    order_of_payment: {
      total_amount: 80,
      payment_detail: { attachment: "or-4.jpg" },
    },
    status_histories: [
      { status_code: "returned", remarks: "Blurry OR" },
      { status_code: "declined", remarks: "Old decline" },
    ],
  }),
  app(5, "for_signature", { order_of_payment: { total_amount: 90 } }),
  app(6, "completed", { order_of_payment: { total_amount: 100 } }),
  app(7, "declined", {
    status_histories: [
      { status_code: "returned", remarks: "Older return" },
      { status_code: "declined", remarks: "Missing ID" },
    ],
  }),
];

const setup = ({ rows, accountType = "individual", props = {} }) => {
  mockState = {
    user: { accountType },
    specialPermitClient: {
      clientTableData: { data: rows },
      getTableDataIsFetching: false,
      params: {},
    },
  };
  const all = {
    applicationType: "mayors_permit",
    activeTab: "mayors_permit",
    ...props,
  };
  return render(<ClientTable {...all} />);
};

const rowByIndex = (i) => screen.getAllByRole("row")[i + 1]; // skip header

beforeEach(() => mockDispatch.mockClear());

describe("ClientTable mixed stages (individual, mayors_permit)", () => {
  beforeEach(() => setup({ rows: mayorsRows }));

  test("each row shows its own stage label", () => {
    const labels = screen.getAllByTestId("row-status").map((b) => b.textContent);
    expect(labels).toEqual([
      "Initial Receiving",
      "Initial Action",
      "Final Receiving",
      "Returned Payment",
      "Issuance",
      "Completed",
      "Returned Application",
    ]);
  });

  test("actions appear only on the matching stage row", () => {
    const actionsFor = (i) => within(rowByIndex(i));
    // index: 0 pending,1 for_payment,2 approval,3 returned,4 signature,5 completed,6 declined
    [0, 2, 4].forEach((i) => {
      expect(actionsFor(i).queryByRole("button")).toBeNull();
    });
    expect(actionsFor(1).getByRole("button", { name: "Pay" })).toBeTruthy();
    expect(actionsFor(1).getByText("Unpaid")).toBeTruthy();
    expect(actionsFor(3).getByRole("button", { name: "Reupload O.R" })).toBeTruthy();
    expect(actionsFor(3).getByTestId("file-official_receipt").textContent).toBe("or-4.jpg");
    expect(actionsFor(5).getByRole("button", { name: /Download/ })).toBeTruthy();
    expect(actionsFor(5).getByRole("button", { name: /Submit Feedback/ })).toBeTruthy();
    expect(actionsFor(6).getByRole("button", { name: "Revise & Resubmit" })).toBeTruthy();

    expect(screen.getAllByRole("button", { name: "Pay" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Reupload O.R" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Revise & Resubmit" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Download/ })).toHaveLength(1);
  });

  test("reference no only for issuance/completed rows", () => {
    expect(screen.getByText("REF-5")).toBeTruthy();
    expect(screen.getByText("REF-6")).toBeTruthy();
    [1, 2, 3, 4, 7].forEach((id) => expect(screen.queryByText(`REF-${id}`)).toBeNull());
  });

  test("remarks use the history entry matching the row's current status", () => {
    expect(within(rowByIndex(3)).getByText("Blurry OR")).toBeTruthy();
    expect(within(rowByIndex(6)).getByText("Missing ID")).toBeTruthy();
    expect(screen.queryByText("Old decline")).toBeNull();
    expect(screen.queryByText("Older return")).toBeNull();
  });

  test("amount shown when order of payment exists", () => {
    expect(within(rowByIndex(0)).queryByText(/₱/)).toBeNull();
    expect(within(rowByIndex(1)).getByText("₱ 60")).toBeTruthy();
    expect(within(rowByIndex(5)).getByText("₱ 100")).toBeTruthy();
  });

  test("document files render on every row of a personal permit", () => {
    expect(screen.getAllByTestId("file-police_clearance")).toHaveLength(7);
  });

  test("Reupload O.R opens reupload modal for that row only", () => {
    expect(screen.queryByTestId("reupload-modal")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reupload O.R" }));
    expect(screen.getByTestId("reupload-modal").textContent).toBe("[4]");
  });

  test("Pay selects that row and dispatches its id", () => {
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "payIds", ids: [2] });
    expect(screen.getByTestId("pay-modal").textContent).toBe("[2]");
  });

  test("Revise & Resubmit opens the permit-type edit modal for that row", () => {
    fireEvent.click(screen.getByRole("button", { name: "Revise & Resubmit" }));
    expect(screen.getByTestId("mayors-modal").textContent).toBe("7");
  });

  test("no bulk-pay checkboxes for individual accounts", () => {
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});

describe("ClientTable fetch params", () => {
  test("All stages: no status param", () => {
    setup({ rows: [] });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "getClientTableData",
      params: { permit_type: "mayors_permit" },
    });
    expect(screen.getByText("No applications found.")).toBeTruthy();
  });

  test("stage filter: status param sent", () => {
    setup({ rows: [], props: { status: "declined" } });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "getClientTableData",
      params: { permit_type: "mayors_permit", status: "declined" },
    });
  });

  test("inactive tab does not fetch", () => {
    setup({ rows: [], props: { activeTab: "good_moral" } });
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

describe("ClientTable company bulk payment (occupational)", () => {
  const rows = [
    app(10, "for_payment", { order_of_payment: { total_amount: 50, payment_on_progress: 0 } }),
    app(11, "for_payment", { order_of_payment: { total_amount: 50, payment_on_progress: 1 } }),
    app(12, "for_payment", { order_of_payment: { total_amount: 50, payment_on_progress: 0 } }),
    app(13, "declined"),
    app(14, "pending"),
  ];
  const props = { applicationType: "occupational_permit", activeTab: "occupational_permit" };

  test("checkboxes only on for_payment rows; in-progress disabled", () => {
    setup({ rows, accountType: "company", props });
    expect(screen.getByLabelText("Select application 10")).toBeTruthy();
    expect(screen.getByLabelText("Select application 11").disabled).toBe(true);
    expect(screen.getByLabelText("Select application 12")).toBeTruthy();
    expect(screen.queryByLabelText("Select application 13")).toBeNull();
    expect(screen.queryByLabelText("Select application 14")).toBeNull();
    // company rows have no individual Pay button
    expect(screen.getAllByRole("button", { name: "Pay" })).toHaveLength(1);
  });

  test("select-all picks only payable rows and Pay sends them", () => {
    setup({ rows, accountType: "company", props });
    const pay = screen.getByRole("button", { name: "Pay" });
    expect(pay.disabled).toBe(true);
    fireEvent.click(screen.getByLabelText("Select all for payment"));
    expect(pay.disabled).toBe(false);
    fireEvent.click(pay);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "payIds", ids: [10, 12] });
    expect(screen.getByTestId("pay-modal").textContent).toBe("[10,12]");
  });

  test("a non-payable row picked via another action is never paid", () => {
    setup({ rows, accountType: "company", props });
    fireEvent.click(screen.getByRole("button", { name: "Revise & Resubmit" }));
    const pay = screen.getByRole("button", { name: "Pay" });
    expect(pay.disabled).toBe(true);
    fireEvent.click(screen.getByLabelText("Select application 12"));
    fireEvent.click(pay);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "payIds", ids: [12] });
  });

  test("no bulk Pay button when nothing is payable", () => {
    setup({ rows: [app(20, "pending")], accountType: "company", props });
    expect(screen.queryByRole("button", { name: "Pay" })).toBeNull();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});
