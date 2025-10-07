import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faPhoneVolume, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Badge, Col, Row, Table } from "reactstrap";
const convert = (str) => {
  return str
    .split("_") //
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
};
export default function RecordDetailsModal({ selectedRecord }) {
  return (
    <div>
      <Row className="mb-2">
        <Col className="text-center">
          <h3>
            <Badge
              color="primary"
              style={{
                width: "200px",
                fontSize: "1.3rem",
                fontWeight: 600,
                letterSpacing: "1px",
                fontFamily: "'Segoe UI', Arial, sans-serif",
              }}
            >
              {selectedRecord.business_code}
            </Badge>
          </h3>
        </Col>
      </Row>
      <Col className="d-flex gap-2 flex-column p-3">
        <Row>
          <h2
            className="text-center"
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#27479A",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              letterSpacing: "1px",
              marginBottom: "0.5rem",
            }}
          >
            {selectedRecord.business_name}
          </h2>
        </Row>
        <Row>
          <Col
            className="overflow-hidden"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: 0,
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "0.25rem",
                fontWeight: 600,
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: "#27479A",
                fontSize: "1.1rem",
              }}
            >
              Receiver&apos;s Picture
            </div>
            <img
              src={selectedRecord.receiver_photo}
              className="img-fluid border border-secondary"
              style={{
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                width: "100%",
                height: "220px",
                maxWidth: "100%",
                display: "block",
              }}
              alt="Receiver Photo"
            />
          </Col>
        </Row>
        <Row>
          <Table
            responsive
            bordered
            style={{
              fontFamily: "'Segoe UI', Arial, sans-serif",
              fontSize: "1.05rem",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: "30%",
                    fontWeight: 600, // changed from 500 to 600 for semi-bold
                    background: "#f8f9fa",
                  }}
                  className="text-end"
                >
                  Released Date:
                </td>
                <td
                  style={{
                    color: "#27479A",
                    fontWeight: 600,
                  }}
                  className="text-center"
                >
                  {selectedRecord.released_at}
                </td>
              </tr>

              <tr>
                <td
                  className="text-end"
                  style={{
                    fontWeight: 600, // changed from 500 to 600 for semi-bold
                    background: "#f8f9fa",
                  }}
                >
                  Receiver Name:
                </td>
                <td
                  style={{
                    color: "#27479A",
                    fontWeight: 600,
                  }}
                  className="text-center"
                >
                  {selectedRecord.receiver_name}
                </td>
              </tr>
              <tr>
                <td
                  className="text-end"
                  style={{
                    fontWeight: 600, // changed from 500 to 600 for semi-bold
                    background: "#f8f9fa",
                  }}
                >
                  Relationship To The Owner:
                </td>
                <td
                  style={{
                    color: "#27479A",
                    fontWeight: 600,
                  }}
                  className="text-center"
                >
                  {selectedRecord.receiver_relationship_to_owner}
                </td>
              </tr>
              <tr>
                <td
                  className="text-end"
                  style={{
                    fontWeight: 600, // changed from 500 to 600 for semi-bold
                    background: "#f8f9fa",
                  }}
                >
                  Receiver ID:
                </td>
                <td
                  style={{
                    color: "#27479A",
                    fontWeight: 600,
                  }}
                  className="text-center"
                >
                  {`${convert(selectedRecord.receiver_id_type)} - ${
                    selectedRecord.receiver_id_no
                  } `}
                </td>
              </tr>
            </tbody>
          </Table>
          <Row>
            <Col
              md={12}
              className="d-flex flex-row justify-content-around align-items-center gap-3"
            >
              <div
                className="d-flex flex-row gap-2 align-items-center"
                style={{
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  fontSize: "1.05rem",
                }}
              >
                <FontAwesomeIcon
                  icon={faPhoneVolume}
                  style={{ color: "#27479A" }}
                />
                <span style={{ fontWeight: 500 }}>
                  {selectedRecord.receiver_phone_number}
                </span>
              </div>
              {selectedRecord.receiver_email ? (
                <div
                  className="d-flex flex-row gap-2 align-items-center"
                  style={{
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    fontSize: "1.05rem",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ color: "#27479A" }}
                  />
                  <span style={{ fontWeight: 500 }}>
                    {selectedRecord.receiver_email}
                  </span>
                </div>
              ) : null}
            </Col>
          </Row>
        </Row>

        <Row>
          <Col
            className="overflow-hidden"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: 0,
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "0.25rem",
                fontWeight: 600,
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: "#27479A",
                fontSize: "1.1rem",
              }}
            >
              Receiver&apos;s Signature
            </div>
            <img
              src={selectedRecord.receiver_signature}
              className="img-fluid border border-secondary bg-white"
              style={{
                objectFit: "contain",
                borderRadius: "4px",
                width: "100%",
                height: "80px",
                maxWidth: "100%",
                display: "block",
              }}
              alt="Receiver Signature"
            />
          </Col>
        </Row>
      </Col>
    </div>
  );
}
