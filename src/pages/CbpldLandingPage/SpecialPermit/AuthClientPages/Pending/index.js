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
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import Pagination from "components/Pagination";
import ClientTable from "../Common/ClientTable";
const Pending = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [activeTab, setActiveTab] = useState("mayors_permit");

  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(
    user.accountType === "company" ? "occupational_permit" : "mayors_permit"
  );
  const handleTabSelect = (key) => {
    setActiveTab(key);
    setNewCounts((prev) => ({
      ...prev,
      [key]: {},
    }));
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
          <Breadcrumbs
            title="Special Permit"
            breadcrumbItem="Pending Applications"
          />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {user.accountType === "individual" ? (
                    <Tabs
                      // defaultActiveKey="mayorsCertificate"

                      className="mb-3"
                      activeKey={activeTab}
                      onSelect={handleTabSelect}
                    >
                      <Tab eventKey="mayors_permit" title="MAYORS CERTIFICATE">
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"mayors_permit"}
                        />
                      </Tab>
                      <Tab eventKey="good_moral" title="GOOD MORAL">
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"good_moral"}
                        />
                      </Tab>
                      <Tab eventKey="event" title="EVENT">
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"event"}
                        />
                      </Tab>
                      <Tab eventKey="motorcade" title="MOTORCADE">
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"motorcade"}
                        />
                      </Tab>
                      <Tab eventKey="parade" title="PARADE">
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"parade"}
                        />
                      </Tab>
                      <Tab eventKey="recorrida" title="RECORRIDA">
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"recorrida"}
                        />
                      </Tab>
                      <Tab
                        eventKey="use_of_government_property"
                        title="USE OF GOVERNMENT PROPERTY"
                      >
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"use_of_government_property"}
                        />
                      </Tab>

                      <Tab
                        eventKey="occupational_permit"
                        title="OCCUPATIONAL PERMIT"
                      >
                        <ClientTable
                          status={"pending"}
                          activeTab={activeTab}
                          applicationType={"occupational_permit"}
                        />
                      </Tab>
                    </Tabs>
                  ) : (
                    <ClientTable
                      status={"pending"}
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

export default Pending;
