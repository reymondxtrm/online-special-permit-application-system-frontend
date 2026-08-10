/* eslint-disable padded-blocks */
import React, { useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import DashboardFilters from "pages/Dashboard/dashboardFilters";

import OfflineTable from "./Table/OfflineTable";
const Dashboard = () => {
  document.title = "BPLD | OFFLINE TRANSACTION";

  const [activeTab, setActiveTab] = useState("good_moral");
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

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
                    // action={getOfflineTransaction()}
                    tableParams={{
                      permit_type: activeTab,
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
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab eventKey="good_moral" title="GOOD MORAL">
                      {activeTab === "good_moral" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab eventKey="event" title="EVENT">
                      {activeTab === "event" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab eventKey="motorcade" title="MOTORCADE">
                      {activeTab === "motorcade" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab eventKey="parade" title="PARADE">
                      {activeTab === "parade" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab eventKey="recorrida" title="RECORRIDA">
                      {activeTab === "recorrida" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab
                      eventKey="use_of_government_property"
                      title="USE OF GOVERNMENT PROPERTY"
                    >
                      {activeTab === "use_of_government_property" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
                    </Tab>
                    <Tab eventKey="occupational" title={"OCCUPATIONAL PERMIT"}>
                      {activeTab === "occupational_permit" ? (
                        <OfflineTable activeTab={activeTab} />
                      ) : null}
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
