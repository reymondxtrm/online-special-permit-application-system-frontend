import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Input, Label } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ClientTable, { STATUS_LABELS } from "../Common/ClientTable";

const PERMIT_TABS = [
  { key: "mayors_permit", title: "MAYORS CERTIFICATE" },
  { key: "good_moral", title: "GOOD MORAL" },
  { key: "event", title: "EVENT" },
  { key: "motorcade", title: "MOTORCADE" },
  { key: "parade", title: "PARADE" },
  { key: "recorrida", title: "RECORRIDA" },
  { key: "use_of_government_property", title: "USE OF GOVERNMENT PROPERTY" },
  { key: "occupational_permit", title: "OCCUPATIONAL PERMIT" },
];

const Applications = () => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(
    user.accountType === "company" ? "occupational_permit" : "mayors_permit",
  );
  const [stage, setStage] = useState("");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Special Permit" breadcrumbItem="My Applications" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Label for="stage-filter" className="mb-0">
                      Stage
                    </Label>
                    <Input
                      id="stage-filter"
                      type="select"
                      style={{ maxWidth: "250px" }}
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                    >
                      <option value="">All</option>
                      {Object.entries(STATUS_LABELS).map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </Input>
                  </div>
                  {user.accountType === "individual" ? (
                    <Tabs
                      className="mb-3"
                      activeKey={activeTab}
                      onSelect={setActiveTab}
                    >
                      {PERMIT_TABS.map((t) => (
                        <Tab key={t.key} eventKey={t.key} title={t.title}>
                          <ClientTable
                            status={stage || undefined}
                            activeTab={activeTab}
                            applicationType={t.key}
                          />
                        </Tab>
                      ))}
                    </Tabs>
                  ) : (
                    <ClientTable
                      status={stage || undefined}
                      activeTab={activeTab}
                      applicationType={"occupational_permit"}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Applications;
