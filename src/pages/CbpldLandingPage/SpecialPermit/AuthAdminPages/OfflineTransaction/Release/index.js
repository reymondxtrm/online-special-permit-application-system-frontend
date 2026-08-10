import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import OfflineTable from "../Table/OfflineTable";
import Breadcrumbs from "components/Common/Breadcrumb";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getOfflineTransaction } from "features/SpecialPermitAdmin";
import ReleaseModal from "../Modal/ReleaseModal";

function Release() {
  document.title = "BPLD | OFFLINE TRANSACTION";

  const [activeTab, setActiveTab] = useState("good_moral");
  const [refresh, setRefresh] = useState(false);
  const [releaseModal, setReleaseModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const tableData = useSelector(
    (state) => state.specialPermitAdmin.offlineTransaction,
  );
  const dispatch = useDispatch();
  const toggleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  const toggleReleaseModal = () => {
    setReleaseModal((prev) => !prev);
  };
  useEffect(() => {
    dispatch(
      getOfflineTransaction({ permit_type: activeTab, status: "received" }),
    );
  }, [refresh, activeTab]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Offline Transaction" breadcrumbItem="Release" />
        {releaseModal && (
          <ReleaseModal
            isOpen={releaseModal}
            toggle={toggleReleaseModal}
            toggleRefresh={toggleRefresh}
            selectedItem={selectedRow}
          />
        )}
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <DashboardFilters
                  action={getOfflineTransaction()}
                  tableParams={{
                    permit_type: activeTab,
                    status: "received",
                  }}
                  // withDateRange
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* TABLE AREA */}
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <hr />

                {/* TABS */}
                <Tabs
                  className="mb-3"
                  activeKey={activeTab}
                  onSelect={handleTabSelect}
                >
                  <Tab eventKey="mayors_permit" title="MAYORS CERTIFICATE">
                    {activeTab === "mayors_permit" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab eventKey="good_moral" title="GOOD MORAL">
                    {activeTab === "good_moral" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab eventKey="event" title="EVENT">
                    {activeTab === "event" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab eventKey="motorcade" title="MOTORCADE">
                    {activeTab === "motorcade" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab eventKey="parade" title="PARADE">
                    {activeTab === "parade" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab eventKey="recorrida" title="RECORRIDA">
                    {activeTab === "recorrida" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab
                    eventKey="use_of_government_property"
                    title="USE OF GOVERNMENT PROPERTY"
                  >
                    {activeTab === "use_of_government_property" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>

                  <Tab
                    eventKey="occupational_permit"
                    title="OCCUPATIONAL PERMIT"
                  >
                    {activeTab === "occupational_permit" && (
                      <OfflineTable
                        activeTab={activeTab}
                        toggleModal={toggleReleaseModal}
                        setSelectedRow={setSelectedRow}
                        status="received"
                      />
                    )}
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Release;
