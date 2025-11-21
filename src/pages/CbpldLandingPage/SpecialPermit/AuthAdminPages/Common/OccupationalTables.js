import { Tab } from "bootstrap";
import React from "react";
import { Tabs } from "react-bootstrap";
import { Col, Row } from "reactstrap";
import OccupationalTableAdmin from "./OccupationalTableCompanyAdmin";
import { useState } from "react";
import OccupationalTableIndividualAdmin from "./OccupationalTableIndividualAdmin";
import AdminTable from "./AdminTable";

const OccupationalTables = ({ status }) => {
  const [activeTab, setActiveTab] = useState("individual");
  const handleSelectTab = (key) => {
    setActiveTab(key);
  };
  return (
    <Row>
      <Col>
        <Tabs activeKey={activeTab} onSelect={handleSelectTab} unmountOnExit>
          <Tab eventKey={"individual"} title="INDIVIDUAL">
            <OccupationalTableIndividualAdmin status={status} />
            {/* <AdminTable status={status} /> */}
          </Tab>
          <Tab eventKey={"company"} title="COMPANY">
            <OccupationalTableAdmin status={status} />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};
export default OccupationalTables;
