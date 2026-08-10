import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import OfflineTable from "../Table/OfflineTable";
import Breadcrumbs from "components/Common/Breadcrumb";
import { Tab } from "bootstrap";
import { Tabs } from "react-bootstrap";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import OfflineTransactionModal from "../Modal/OfflineTransactionModal";
import { useDispatch } from "react-redux";
import { getOfflineTransaction } from "features/SpecialPermitAdmin";
import axios from "axios";
import DetailsModal from "../Modal/DetailsButton";

function OfflineDashboard() {
  document.title = "BPLD | OFFLINE TRANSACTION";
  const [activeTab, setActiveTab] = useState("good_moral");
  const [offlineTransactionModal, setOfflineTransactionModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [permitTypes, setPermitTypes] = useState([]);

  const [idTypes, setIdTypes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();

  const toggleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  const handleAddNew = () => {
    console.log("Add New clicked for:", activeTab);
    toggleOfflineTransactionModal();
  };
  useEffect(() => {
    dispatch(
      getOfflineTransaction({ permit_type: activeTab, status: "released" }),
    );
  }, [refresh, activeTab]);
  const toggleOfflineTransactionModal = () => {
    setOfflineTransactionModal((prev) => !prev);
  };
  useEffect(() => {
    const fetchPermitTypes = async () => {
      try {
        const response = await axios.get("api/admin/get/permit-types");
        setPermitTypes(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch permit types", error);
      }
    };

    fetchPermitTypes();
  }, []);
  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const response = await axios.get("api/get-primary-id-type");
        setIdTypes(() =>
          response.data.map((item) => ({ value: item.id, label: item.name })),
        );
      } catch (error) {
        console.error("Failed to fetch permit types", error);
      }
    };

    fetchIdTypes();
  }, []);
  const permitTypeOptions = useMemo(() => {
    return permitTypes.map((item) => ({
      value: item.code,
      label: item.name,
    }));
  }, [permitTypes]);
  const toggleDownload = async () => {
    try {
      const response = await axios.get("api/admin/get/offline-transactions", {
        params: {
          permit_type: activeTab, // your existing filters
          status: "released",
          generate: true,
        },
        responseType: "blob", // critical for file downloads
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `receiving-releasing-record-${new Date().getFullYear()}.docx`;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="page-content">
      <Container fluid>
        <OfflineTransactionModal
          isOpen={offlineTransactionModal}
          toggle={toggleOfflineTransactionModal}
          toggleRefresh={toggleRefresh}
          permitTypeOptions={permitTypeOptions}
          selectedData={selectedRow}
        />
        <Breadcrumbs title="Offline Transaction" breadcrumbItem="Dashboard" />
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <DashboardFilters
                  action={getOfflineTransaction}
                  tableParams={{
                    permit_type: activeTab,
                    status: "released",
                  }}
                  withDateRange
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Offline Transactions</h5>
                  <div className="d-flex gap-2">
                    <Button color="success" onClick={toggleDownload}>
                      Download
                    </Button>
                    <Button color="primary" onClick={handleAddNew}>
                      + Add New
                    </Button>
                  </div>
                </div>
                <hr />
                <Tabs
                  xs={12}
                  className="mb-3"
                  activeKey={activeTab}
                  onSelect={handleTabSelect}
                >
                  <Tab eventKey="mayors_permit" title="MAYORS CERTIFICATE">
                    {activeTab === "mayors_permit" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab eventKey="good_moral" title="GOOD MORAL">
                    {activeTab === "good_moral" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab eventKey="event" title="EVENT">
                    {activeTab === "event" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab eventKey="motorcade" title="MOTORCADE">
                    {activeTab === "motorcade" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab eventKey="parade" title="PARADE">
                    {activeTab === "parade" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab eventKey="recorrida" title="RECORRIDA">
                    {activeTab === "recorrida" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab
                    eventKey="use_of_government_property"
                    title="USE OF GOVERNMENT PROPERTY"
                  >
                    {activeTab === "use_of_government_property" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
                  </Tab>
                  <Tab
                    eventKey="occupational_permit"
                    title={"OCCUPATIONAL PERMIT"}
                  >
                    {activeTab === "occupational_permit" ? (
                      <OfflineTable
                        activeTab={activeTab}
                        status="released"
                        setSelectedRow={setSelectedRow}
                      />
                    ) : null}
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

export default OfflineDashboard;
