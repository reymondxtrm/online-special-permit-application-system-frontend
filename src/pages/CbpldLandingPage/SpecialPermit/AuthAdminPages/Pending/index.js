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
  Badge,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import classnames from "classnames";
import echo from "../Common/echo";
import Pagination from "components/Pagination";
import AdminTable from "../Common/AdminTable";
import { set } from "lodash";
const Pending = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("good_moral");
  const [newCounts, setNewCounts] = useState({
    mayors_permit: 0,
    good_moral: 0,
    event: 0,
    motorcade: 0,
    parade: 0,
    recorrida: 0,
    use_of_government_property: 0,
  });
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  const options = [
    { value: 1, label: "2023" },
    { value: 2, label: "2024" },
  ];
  const opcr = useSelector((state) => state.opcr);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newMfoModal, setNewMfoModal] = useState(false);
  const toggleNewMfoModal = () => {
    setNewMfoModal(!newMfoModal);
  };

  useEffect(() => {
    const channel = echo.channel("special-permit-pending");
    const handler = (event) => {
      const { documentType, count } = event;
      // Only update state if value actually changes to avoid extra renders
      console.log(event);
      setNewCounts((prevCounts) => {
        return { ...prevCounts, [documentType]: count };
      });
    };
    channel.listen(".document.stage_moved", handler);

    return () => {
      try {
        channel.stopListening(".document.stage_moved", handler);
        echo.leaveChannel("special-permit-pending");
      } catch (err) {}
    };
  }, []);

  useEffect(() => {
    const fetchInitialCounts = async () => {
      try {
        const response = await axios.get(
          "api/admin/special-permit/all-counts",
          { params: { permit_type_id: 1 } }
        );

        if (response && response.data) {
          setNewCounts((prev) => {
            const updatedCounts = { ...prev };

            response?.data?.forEach((item) => {
              updatedCounts[item.code] = item.total;
            });

            return updatedCounts;
          });
        }
      } catch (error) {
        console.error("Error fetching initial counts:", error);
      }
    };
    fetchInitialCounts();
  }, []);
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
                  <Tabs
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                    unmountOnExit
                  >
                    <Tab
                      eventKey="mayors_permit"
                      title={
                        <>
                          MAYORS CERTIFICATE{" "}
                          {newCounts.mayors_permit !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.mayors_permit}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        count={newCounts.mayors_permit}
                        applicationType="mayors_permit"
                      />
                    </Tab>

                    <Tab
                      eventKey="good_moral"
                      title={
                        <>
                          GOOD MORAL{" "}
                          {newCounts.good_moral !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.good_moral}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        applicationType="good_moral"
                      />
                    </Tab>

                    <Tab
                      eventKey="event"
                      title={
                        <>
                          EVENT{" "}
                          {newCounts.event !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.event}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        applicationType="event"
                      />
                    </Tab>

                    <Tab
                      eventKey="motorcade"
                      title={
                        <>
                          MOTORCADE{" "}
                          {newCounts.motorcade !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.motorcade}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        applicationType="motorcade"
                      />
                    </Tab>

                    <Tab
                      eventKey="parade"
                      title={
                        <>
                          PARADE{" "}
                          {newCounts.parade !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.parade}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        applicationType="parade"
                      />
                    </Tab>

                    <Tab
                      eventKey="recorrida"
                      title={
                        <>
                          RECORRIDA{" "}
                          {newCounts.recorrida !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.recorrida}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        applicationType="recorrida"
                      />
                    </Tab>

                    <Tab
                      eventKey="use_of_government_property"
                      title={
                        <>
                          USE OF GOVERNMENT PROPERTY{" "}
                          {newCounts.use_of_government_property !== 0 && (
                            <Badge color="danger" className="ms-1">
                              {newCounts.use_of_government_property}
                            </Badge>
                          )}
                        </>
                      }
                    >
                      <AdminTable
                        status="pending"
                        activeTab={activeTab}
                        applicationType="use_of_government_property"
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

export default Pending;

/* eslint-disable padded-blocks */
