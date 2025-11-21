import React, { useRef, useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toJpeg } from "html-to-image";
import { useSelector } from "react-redux";
import axios from "axios";

function OrderOfPaymentModal({
  openModal,
  toggleModal,
  orderOfPaymentData,
  applicationType,
  isLoading,
  descriptions,
  formatDate,
  userData,
  clearance,
  quantity = 1,
  paymentDetails,
}) {
  const ref = useRef();
  const downloadImage = () => {
    if (ref.current) {
      toJpeg(ref.current, { quality: 0.95, backgroundColor: "#ffffff" })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "order_of_payment.jpg";
          link.click();
        })
        .catch((err) => {
          console.error("Could not generate image", err);
        });
    }
  };
  // console.log(created_at, fullname);

  return (
    <React.Fragment>
      <Modal
        isOpen={openModal}
        toggle={toggleModal}
        fade={true}
        backdrop="static"
        size="lg"
        className="modal-dialog-centered"
        style={{ overflowY: "auto" }}
        unmountOnClose
      >
        <ModalHeader toggle={toggleModal}>
          <p
            style={{
              fontWeight: "bold",
              letterSpacing: ".2rem",
              fontSize: "18pt",
              margin: 0,
              padding: 0,
              color: "#368be0",
            }}
          >
            ORDER OF PAYMENT
          </p>
        </ModalHeader>
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              ref={ref}
              style={{
                width: "600px",
                border: "2px solid black",
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.5,
                backgroundColor: "white",
                color: "black",
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p>Republic of the Philippines</p>
                <p>
                  <strong>
                    CITY BUSINESS PERMITS AND LICENSING DEPARTMENT
                  </strong>
                </p>
                <h2
                  style={{
                    margin: "10px 0",
                    fontSize: "18px",
                    textDecoration: "underline",
                    fontWeight: "bold",
                  }}
                >
                  ORDER OF PAYMENT
                </h2>
              </div>

              {/* Name Section */}
              <div style={{ marginBottom: "20px" }}>
                <strong>NAME:</strong>
                <strong>{isLoading ? "loading" : userData?.full_name}</strong>
              </div>

              {/* Table Section */}
              <div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          textAlign: "left",
                          fontWeight: "bold",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          textAlign: "left",
                          fontWeight: "bold",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        Quantity
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {descriptions.map((desc, idx) => (
                      <React.Fragment key={idx}>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            &bull; {desc.label}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "right",
                            }}
                          >
                            {applicationType === desc.type
                              ? paymentDetails.quantity
                              : null}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "right",
                            }}
                          >
                            {applicationType === desc.type
                              ? paymentDetails.billed_amount
                              : null}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                    <tr>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Grand Total:
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                        }}
                      >
                        {paymentDetails?.quantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "8px",
                          textAlign: "right",
                        }}
                      >
                        {`₱ ${paymentDetails.total_amount}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ marginTop: "20px", textAlign: "left" }}>
                <p>
                  <strong>Evaluated by:</strong>{" "}
                  <strong>{paymentDetails?.fullname}</strong>
                  <br />
                  <strong>Date and Time: </strong>
                  {formatDate(paymentDetails?.created_at)}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontSize: "12px",
                  }}
                >
                  CBPLD.BPLD.F.020.REV.00
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "#1a56db",
              fontWeight: "600",
              fontFamily: "Arial, sans-serif",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={downloadImage}
          >
            Download
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default OrderOfPaymentModal;
