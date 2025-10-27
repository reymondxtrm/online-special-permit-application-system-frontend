/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  TabContent,
  TabPane,
  CardTitle,
  CardText,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";

import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import AdminTable from "../Common/AdminTable";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import { getTableData } from "features/SpecialPermitAdmin";
const Dashboard = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("good_moral");
  const specialPermitAdmin = useSelector((state) => state.specialPermitAdmin);
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  const options = [
    { value: 1, label: "2023" },
    { value: 2, label: "2024" },
  ];
  const opcr = useSelector((state) => state.opcr);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const toggleupdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const [newMfoModal, setNewMfoModal] = useState(false);
  const toggleNewMfoModal = () => {
    setNewMfoModal(!newMfoModal);
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
                    action={getTableData}
                    tableParams={specialPermitAdmin.params}
                  />
                  <hr />
                  <Tabs
                    // defaultActiveKey="mayorsCertificate"

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
                    {/* <Tab
                      eventKey="occupational_permit"
                      title="OCCUPATIONAL PERMIT"
                    >
                      {activeTab === "occupational_permit" ? (
                        <AdminTable
                          status={"for_payment"}
                          activeTab={activeTab}
                          applicationType={"occupational_permit"}
                        />
                      ) : null}
                    </Tab> */}
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
