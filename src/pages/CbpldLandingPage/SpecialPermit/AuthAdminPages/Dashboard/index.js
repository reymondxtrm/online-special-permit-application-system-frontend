/* eslint-disable padded-blocks */
import React, { useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import AdminTable from "../Common/AdminTable";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import {
  getCompanyOccupatinalData,
  getIndividualOccupationalApplications,
  getTableData,
} from "features/SpecialPermitAdmin";
import OccupationalTables from "../Common/OccupationalTables";
import EditDurationModal from "./Modal/EditDurationModal";
const Dashboard = () => {
  document.title = "BPLD | SPECIAL PERMIT";
  const [childTab, setChildTab] = useState("individual");

  const handleSelectChildTab = (key) => {
    setChildTab(key);
  };
  const [activeTab, setActiveTab] = useState("good_moral");
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  const action = useMemo(() => {
    if (activeTab === "occupational" && childTab === "company") {
      return getCompanyOccupatinalData;
    } else if (activeTab === "occupational" && childTab === "individual") {
      return getIndividualOccupationalApplications;
    } else {
      return getTableData;
    }
  }, [activeTab, childTab]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Special Permit" breadcrumbItem="Dashboard" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <DashboardFilters
                    action={action}
                    tableParams={{
                      permit_type: activeTab,
                      status: "completed",
                      type: childTab || "",
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <hr />
                  <Tabs
                    xs={12}
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                  >
                    <Tab eventKey="mayors_permit" title="MAYORS CERTIFICATE">
                      {activeTab === "mayors_permit" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"mayors_permit"}
                        />
                      ) : null}
                    </Tab>
                    <Tab eventKey="good_moral" title="GOOD MORAL">
                      {activeTab === "good_moral" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"good_moral"}
                        />
                      ) : null}
                    </Tab>
                    <Tab eventKey="event" title="EVENT">
                      {activeTab === "event" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"event"}
                        />
                      ) : null}
                    </Tab>
                    <Tab eventKey="motorcade" title="MOTORCADE">
                      {activeTab === "motorcade" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"motorcade"}
                        />
                      ) : null}
                    </Tab>
                    <Tab eventKey="parade" title="PARADE">
                      {activeTab === "parade" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"parade"}
                        />
                      ) : null}
                    </Tab>
                    <Tab eventKey="recorrida" title="RECORRIDA">
                      {activeTab === "recorrida" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"recorrida"}
                        />
                      ) : null}
                    </Tab>
                    <Tab
                      eventKey="use_of_government_property"
                      title="USE OF GOVERNMENT PROPERTY"
                    >
                      {activeTab === "use_of_government_property" ? (
                        <AdminTable
                          status={"completed"}
                          activeTab={activeTab}
                          applicationType={"use_of_government_property"}
                        />
                      ) : null}
                    </Tab>
                    <Tab
                      eventKey="occupational"
                      title={<>OCCUPATIONAL PERMIT </>}
                    >
                      <OccupationalTables
                        status={"completed"}
                        motherTab={activeTab}
                        childTab={childTab}
                        handleSelectChildTab={handleSelectChildTab}
                      />
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
