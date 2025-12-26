/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";

import Tabs from "react-bootstrap/Tabs";

import Pagination from "components/Pagination";
import ClientTable from "../../Common/ClientTable";
const Returned = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(
    user.accountType === "company" ? "occupational_permit" : "mayors_permit"
  );
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Special Permit"
            breadcrumbItem="For Payment Applications"
          />
          {/* 
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Col md="3">
                    <Label className="form-label">Select Year:</Label>
                    <Select
                      style={{ zIndex: "1" }}
                      options={options}
                      placeholder="Select Year"
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row> */}
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {user.accountType === "individual" ? (
                    <Tabs
                      className="mb-3"
                      activeKey={activeTab}
                      onSelect={handleTabSelect}
                    >
                      <Tab eventKey="mayors_permit" title="MAYORS CERTIFICATE">
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"mayors_permit"}
                        />
                      </Tab>
                      <Tab eventKey="good_moral" title="GOOD MORAL">
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"good_moral"}
                        />
                      </Tab>
                      <Tab eventKey="event" title="EVENT">
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"event"}
                        />
                      </Tab>
                      <Tab eventKey="motorcade" title="MOTORCADE">
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"motorcade"}
                        />
                      </Tab>
                      <Tab eventKey="parade" title="PARADE">
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"parade"}
                        />
                      </Tab>
                      <Tab eventKey="recorrida" title="RECORRIDA">
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"recorrida"}
                        />
                      </Tab>
                      <Tab
                        eventKey="use_of_government_property"
                        title="USE OF GOVERNMENT PROPERTY"
                      >
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"use_of_government_property"}
                        />
                      </Tab>

                      <Tab
                        eventKey="occupational_permit"
                        title="OCCUPATIONAL PERMIT"
                      >
                        <ClientTable
                          status={"returned"}
                          activeTab={activeTab}
                          applicationType={"occupational_permit"}
                        />
                      </Tab>
                    </Tabs>
                  ) : (
                    <ClientTable
                      status={"returned"}
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

export default Returned;
