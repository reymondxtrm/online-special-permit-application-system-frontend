import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Alert,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getOfflineTransactionDetails } from "features/SpecialPermitAdmin";

const StatusDot = ({ active, color }) => (
  <div
    className={`rounded-circle mx-auto mb-1 bg-${active ? color : "light"}`}
    style={{ width: 32, height: 32 }}
  />
);

const InfoRow = ({ label, value }) => (
  <p className="mb-1">
    <strong>{label}:</strong> {value || "-"}
  </p>
);

const DetailButton = ({ selectedItem }) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  /* =========================
     FIXED REDUX STATE
  ========================= */
  const {
    singleOfflineTransaction: data,
    getOfflineTransactionDetails: loading,
    error,
  } = useSelector((state) => state.specialPermitAdmin);

  const toggle = () => setModal((v) => !v);

  useEffect(() => {
    if (modal && selectedItem) {
      dispatch(getOfflineTransactionDetails({ id: selectedItem }));
    }
  }, [modal, selectedItem, dispatch]);

  /* =========================
     SAFE DATA
  ========================= */
  const currentStatus = data?.current_status || "pending";

  const receiver = useMemo(() => {
    // backend returns array, but usually you want latest receiver
    return data?.receivers?.length
      ? data.receivers[data.receivers.length - 1]
      : null;
  }, [data]);

  const statusList = useMemo(() => {
    return [
      { code: "pending", label: "Pending", color: "warning" },
      { code: "released", label: "Released", color: "success" },
    ];
  }, []);

  const isReleased = currentStatus === "released";

  return (
    <>
      <Button color="primary" size="sm" onClick={toggle}>
        Details
      </Button>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>Transaction Details</ModalHeader>

        <ModalBody>
          {/* ================= LOADING ================= */}
          {loading && (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && !loading && (
            <Alert color="danger">Failed to load transaction details.</Alert>
          )}

          {/* ================= CONTENT ================= */}
          {!loading && !error && data && (
            <>
              {/* ================= STATUS ================= */}
              <Card className="mb-3">
                <CardHeader>Status</CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    {statusList.map((s, idx) => (
                      <React.Fragment key={s.code}>
                        <div className="text-center flex-fill">
                          <StatusDot
                            active={
                              statusList.findIndex(
                                (x) => x.code === currentStatus,
                              ) >= idx
                            }
                            color={s.color}
                          />
                          <small>{s.label}</small>
                        </div>

                        {idx !== statusList.length - 1 && (
                          <div
                            style={{
                              flex: 1,
                              height: 2,
                              background: "#ddd",
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* ================= TRANSACTION INFO ================= */}
              <Card className="mb-3">
                <CardHeader>Transaction Info</CardHeader>
                <CardBody>
                  <InfoRow label="Control #" value={data?.control_number} />
                  <InfoRow label="Requestor" value={data?.requestor_name} />
                  <InfoRow label="Date" value={data?.date} />
                  <InfoRow label="Time" value={data?.time} />

                  <InfoRow
                    label="Permit Type"
                    value={data?.special_permit_type?.name}
                  />

                  <Badge color={isReleased ? "success" : "warning"}>
                    {currentStatus}
                  </Badge>
                </CardBody>
              </Card>

              {/* ================= RECEIVER ================= */}
              {isReleased && receiver && (
                <Card>
                  <CardHeader>Receiver</CardHeader>
                  <CardBody>
                    <InfoRow label="Name" value={receiver?.name} />
                    <InfoRow label="Phone" value={receiver?.phone_number} />
                    <InfoRow
                      label="ID Type"
                      value={receiver?.id_type_other?.name}
                    />

                    {receiver?.signature && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">
                          Signature
                        </small>
                        <img
                          src={receiver.signature}
                          alt="signature"
                          style={{ maxHeight: 80 }}
                        />
                      </div>
                    )}

                    {receiver?.picture && (
                      <div className="mt-3">
                        <small className="text-muted d-block mb-1">Photo</small>
                        <img
                          src={receiver.picture}
                          alt="receiver"
                          style={{ maxHeight: 120 }}
                        />
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* ================= HISTORY (OPTIONAL BUT USEFUL) ================= */}
              {data?.history?.length > 0 && (
                <Card className="mt-3">
                  <CardHeader>History</CardHeader>
                  <CardBody>
                    {data.history.map((h, i) => (
                      <div key={i} className="mb-2">
                        <Badge color="info">{h.status}</Badge>{" "}
                        <small className="text-muted">{h.date}</small>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DetailButton;
