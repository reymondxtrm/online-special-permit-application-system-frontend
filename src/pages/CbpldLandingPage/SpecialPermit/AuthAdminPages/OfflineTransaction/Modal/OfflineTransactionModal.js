import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Input,
  FormFeedback,
  Spinner,
  Row,
  Col,
} from "reactstrap";

const validationSchema = Yup.object({
  special_permit_type_id: Yup.string()
    .nullable()
    .required("Permit type is required"),
  control_number: Yup.string().trim().required("Control number is required"),
  requestor_name: Yup.string()
    .nullable()
    .required("Requestor name is required"),
});

/* ─── Inline style tokens ─────────────────────────────────────────── */
const NAVY = "#0F2044";
const BLUE = "#185FA5";

const s = {
  /* modal shell */
  modalContent: {
    borderRadius: 16,
    overflow: "hidden",
    border: "none",
    boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
  },
  /* header — must NOT clip its own top corners */
  headerTopRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  /* header */
  header: {
    background: NAVY,
    padding: "20px 24px 18px",
    position: "relative",
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 4px",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    lineHeight: 1,
    transition: "background 0.15s",
  },
  /* body */
  body: {
    background: "#F4F6F9",
    padding: "20px 20px 16px",
  },
  /* info grid */
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 10,
  },
  infoCard: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #E8ECF2",
    padding: "12px 14px",
  },
  infoLabel: {
    fontSize: 10,
    letterSpacing: "0.07em",
    color: "#94A3B8",
    margin: "0 0 4px",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1E293B",
    margin: 0,
  },
  /* status badge */
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#EAF3DE",
    color: "#27500A",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    background: "#3B6D11",
    borderRadius: "50%",
    display: "inline-block",
  },
  /* receiver panel */
  receiverPanel: {
    border: "1px solid #E8ECF2",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    background: "#fff",
  },
  receiverHeader: {
    background: "#EFF4FB",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: BLUE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  receiverName: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "#1E293B",
  },
  receiverPhone: {
    fontSize: 12,
    color: "#64748B",
    margin: "2px 0 0",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  receiverBadge: {
    fontSize: 11,
    color: BLUE,
    fontWeight: 600,
  },
  chevronBtn: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: NAVY,
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    cursor: "pointer",
    flexShrink: 0,
  },
  mediaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    padding: "12px 14px",
    background: "#fff",
    borderTop: "1px solid #E8ECF2",
  },
  mediaLabel: {
    fontSize: 10,
    letterSpacing: "0.07em",
    color: "#94A3B8",
    margin: "0 0 8px",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  idBox: {
    height: 120,
    borderRadius: 8,
    background: "#0a0a0a",
    border: "1px solid #222",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sigBox: {
    height: 120,
    borderRadius: 8,
    background: "#F8FAFC",
    border: "1px solid #E8ECF2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  /* history */
  historyLabel: {
    fontSize: 10,
    letterSpacing: "0.08em",
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: 600,
    margin: "0 0 14px",
  },
  historyRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  timelineCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  stepDone: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: BLUE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
  },
  stepCurrent: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: NAVY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#378ADD",
    display: "block",
  },
  connector: {
    width: 1.5,
    height: 28,
    background: "#CBD5E1",
    margin: "4px 0",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "#1E293B",
  },
  badgeDone: {
    fontSize: 11,
    background: "#EAF3DE",
    color: "#27500A",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  badgeCurrent: {
    fontSize: 11,
    background: "#DBEAFE",
    color: "#1E40AF",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 999,
  },
  datePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  datePillDark: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    background: NAVY,
    color: "#B5D4F4",
    padding: "3px 10px",
    borderRadius: 999,
    fontWeight: 500,
    marginTop: 4,
  },
  /* footer */
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: 14,
    marginTop: 4,
    borderTop: "1px solid #E8ECF2",
    gap: 8,
  },
  btnClose: {
    padding: "8px 24px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    background: "#fff",
    color: "#334155",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  btnPrimary: {
    padding: "8px 24px",
    borderRadius: 8,
    border: "none",
    background: BLUE,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "opacity 0.15s",
  },
  /* form fields */
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 6,
    display: "block",
  },
  inputStyle: {
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    fontSize: 14,
    color: "#1E293B",
    background: "#fff",
    padding: "9px 12px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  },
};

/* ─── Read-only detail view ────────────────────────────────────────── */
const DetailView = ({ data, onClose }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ borderRadius: "16px" }}>
      {/* header */}
      <div
        style={{
          ...s.header,
          // borderTopLeftRadius: 16,
          // borderTopRightRadius: 16,
        }}
      >
        <p style={s.headerLabel}>Offline · Transaction Detail</p>
        <h2 style={s.headerTitle}>{data?.control_number || "—"}</h2>
        <button style={s.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      {/* body */}
      <div style={s.body}>
        {/* info grid row 1 */}
        <div style={s.infoGrid}>
          <div style={s.infoCard}>
            <p style={s.infoLabel}>Control number</p>
            <p style={s.infoValue}>{data?.control_number || "—"}</p>
          </div>
          <div style={s.infoCard}>
            <p style={s.infoLabel}>Status</p>
            <span style={s.statusBadge}>
              <span style={s.statusDot} />
              {data?.current_status || "Released"}
            </span>
          </div>
        </div>

        {/* info grid row 2 */}
        <div style={{ ...s.infoGrid, marginBottom: 14 }}>
          <div style={s.infoCard}>
            <p style={s.infoLabel}>Requestor</p>
            <p style={s.infoValue}>{data?.requestor_name || "—"}</p>
          </div>
          <div style={s.infoCard}>
            <p style={s.infoLabel}>Permit type</p>
            <p style={s.infoValue}>
              {data?.permit_type_label || "Event"}{" "}
              <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: 12 }}>
                ({data?.permit_type_slug || "event"})
              </span>
            </p>
          </div>
        </div>

        {/* receiver panel */}
        <div style={s.receiverPanel}>
          <div style={s.receiverHeader} onClick={() => setExpanded((v) => !v)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={s.avatar}>KB</div>
              <div>
                <p style={s.receiverName}>Keefe Burnett</p>
                <p style={s.receiverPhone}>
                  <span style={{ fontSize: 13 }}>📞</span>
                  +1 (953) 387-4209
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <span style={s.receiverBadge}>Receiver</span>
                <p
                  style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}
                >
                  ID #1
                </p>
              </div>
              <button style={s.chevronBtn} aria-label="Toggle details">
                {expanded ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {expanded && (
            <div style={s.mediaRow}>
              <div>
                <p style={s.mediaLabel}>ID picture</p>
                <div style={s.idBox}>
                  <span style={{ fontSize: 24, opacity: 0.3 }}>🚫</span>
                </div>
              </div>
              <div>
                <p style={s.mediaLabel}>Signature</p>
                <div style={s.sigBox}>
                  <svg viewBox="0 0 120 80" width="110" height="70" fill="none">
                    <path
                      d="M15 58 Q30 18 52 42 Q68 58 80 36 Q90 18 108 30"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M44 62 Q60 52 76 60"
                      stroke="#94A3B8"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* transaction history */}
        <p style={s.historyLabel}>Transaction history</p>
        <div style={s.historyRow}>
          <div style={s.timelineCol}>
            <div style={s.stepDone}>✓</div>
            <div style={s.connector} />
            <div style={s.stepCurrent}>
              <span style={s.stepDot} />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              paddingTop: 4,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <p style={s.stepTitle}>Received</p>
                <span style={s.badgeDone}>✓ Done</span>
              </div>
              <div style={s.datePill}>
                <span style={{ fontSize: 12 }}>🕐</span> May 25, 2026
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <p style={s.stepTitle}>Released</p>
                <span style={s.badgeCurrent}>● Current</span>
              </div>
              <div style={s.datePillDark}>
                <span style={{ fontSize: 12 }}>🕐</span> November 13, 1994
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={s.footer}>
          <button style={s.btnClose} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Form fields helper ───────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <FormGroup style={{ marginBottom: 16 }}>
    <label style={s.fieldLabel}>{label}</label>
    {children}
  </FormGroup>
);

/* ─── Main modal ───────────────────────────────────────────────────── */
const OfflineTransactionModal = ({
  isOpen,
  toggle,
  toggleRefresh,
  permitTypeOptions = [],
  selectedData = null,
  viewOnly = false,
}) => {
  const isEdit = Boolean(selectedData?.id);

  const initialValues = useMemo(
    () => ({
      special_permit_type_id: selectedData?.special_permit_type_id || "",
      control_number: selectedData?.control_number || "",
      requestor_name: selectedData?.requestor_name || "",
      current_status: selectedData?.current_status || "pending",
      received_date: new Date().toISOString().split("T")[0],
      received_time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }),
    [selectedData],
  );

  const handleClose = useCallback(() => {
    validation.resetForm();
    toggle?.();
  }, [toggle]);

  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting }) => {
      try {
        const result = await Swal.fire({
          title: isEdit
            ? "Update Offline Transaction?"
            : "Create Offline Transaction?",
          text: "Please confirm your action.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: isEdit ? "Update" : "Create",
          cancelButtonText: "Cancel",
          reverseButtons: true,
          allowOutsideClick: false,
        });

        if (!result.isConfirmed) return;

        Swal.fire({
          title: "Processing...",
          text: "Please wait.",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        const payload = {
          special_permit_type_id: values.special_permit_type_id || null,
          control_number: values.control_number,
          requestor_name: values.requestor_name,
          date: values.received_date,
          time: values.received_time,
        };

        if (isEdit) {
          await axios.put(
            `/api/admin/update-offline-transactions/${selectedData.id}`,
            payload,
            { withCredentials: true },
          );
        } else {
          await axios.post("/api/admin/create-offline-transaction", payload, {
            withCredentials: true,
          });
        }

        Swal.fire({
          icon: "success",
          title: isEdit
            ? "Offline Transaction Updated"
            : "Offline Transaction Created",
          timer: 1500,
          showConfirmButton: false,
        });

        toggleRefresh?.();
        resetForm();
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: error?.response?.data?.message || "Something went wrong.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [handleClose, isEdit, selectedData, toggleRefresh],
  );

  const validation = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const getFieldError = (field) =>
    validation.touched[field] && Boolean(validation.errors[field]);

  const inputProps = (name, extra = {}) => ({
    name,
    value: validation.values[name],
    onChange: validation.handleChange,
    onBlur: validation.handleBlur,
    invalid: getFieldError(name),
    style: {
      ...s.inputStyle,
      borderColor: getFieldError(name) ? "#EF4444" : "#CBD5E1",
    },
    ...extra,
  });

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
      contentClassName="border-0 rounded-0"
    >
      {/* custom modal content wrapper */}
      <div style={s.modalContent}>
        {viewOnly ? (
          <DetailView data={selectedData} onClose={handleClose} />
        ) : (
          <>
            {/* ── Form header ── */}
            <div
              style={{
                ...s.header,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <p style={s.headerLabel}>Offline · Transaction</p>
              <h2 style={s.headerTitle}>
                {isEdit ? "Edit Transaction" : "Create Transaction"}
              </h2>
              <button
                style={s.closeBtn}
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* ── Form body ── */}
            <div style={s.body}>
              <Form onSubmit={validation.handleSubmit} noValidate>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #E8ECF2",
                    padding: "18px 18px 6px",
                    marginBottom: 16,
                  }}
                >
                  <Field label="Permit Type">
                    <Input
                      type="select"
                      {...inputProps("special_permit_type_id")}
                    >
                      <option value="">Select Permit Type</option>
                      {permitTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>
                      {validation.errors.special_permit_type_id}
                    </FormFeedback>
                  </Field>

                  <Field label="Control Number">
                    <Input
                      placeholder="Enter control number"
                      {...inputProps("control_number")}
                    />
                    <FormFeedback>
                      {validation.errors.control_number}
                    </FormFeedback>
                  </Field>

                  <Field label="Requestor Name">
                    <Input
                      placeholder="Enter requestor name"
                      {...inputProps("requestor_name")}
                    />
                    <FormFeedback>
                      {validation.errors.requestor_name}
                    </FormFeedback>
                  </Field>

                  <Row className="g-3" style={{ marginBottom: 6 }}>
                    <Col md={6}>
                      <Field label="Date">
                        <Input type="date" {...inputProps("received_date")} />
                        <FormFeedback>
                          {validation.errors.received_date}
                        </FormFeedback>
                      </Field>
                    </Col>
                    <Col md={6}>
                      <Field label="Time">
                        <Input type="time" {...inputProps("received_time")} />
                        <FormFeedback>
                          {validation.errors.received_time}
                        </FormFeedback>
                      </Field>
                    </Col>
                  </Row>
                </div>

                {/* footer */}
                <div style={s.footer}>
                  <button
                    type="button"
                    style={s.btnClose}
                    onClick={handleClose}
                    disabled={validation.isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...s.btnPrimary,
                      opacity: validation.isSubmitting ? 0.7 : 1,
                    }}
                    disabled={validation.isSubmitting}
                  >
                    {validation.isSubmitting ? (
                      <>
                        <Spinner size="sm" />
                        Processing...
                      </>
                    ) : isEdit ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default OfflineTransactionModal;
