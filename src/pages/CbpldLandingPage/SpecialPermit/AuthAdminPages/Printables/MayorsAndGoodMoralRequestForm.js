import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function MayorsAndGoodMoralRequestForm({ isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    className="header-content"
                    style={{ position: "relative" }}
                  >
                    <div
                      style={{
                        paddingTop: "15px",
                        paddingLeft: "20px",
                        zIndex: "1000",
                      }}
                    >
                      <img
                        src={cgbLogo}
                        alt="CGB Logo"
                        className="header-logo"
                      />
                    </div>
                    <div>
                      <div className="header-text">
                        <p>Republic of the Philippines</p>
                        <p className="header-title">
                          CITY GOVERNMENT OF BUTUAN
                        </p>
                        <p className="header-title">
                          CITY GOVERNMENT PERMITS AND LICENSING DEPARTMENT
                        </p>
                        <p>
                          City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan
                          City
                        </p>
                        <div style={{ marginTop: "5px" }}>
                          <img
                            className="header-line"
                            src={headerLine}
                            alt="CGB Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-center"
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        left: "200px",
                      }}
                    >
                      <h1 className="title">REQUEST FORM FOR SPECIAL PERMIT</h1>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalBody>
    </Modal>
  );
}
