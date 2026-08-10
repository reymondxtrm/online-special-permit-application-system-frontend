import { Tab } from "bootstrap";
import React from "react";
import { Tabs } from "react-bootstrap";
import { Col, Row } from "reactstrap";
import OccupationalTableAdmin from "./OccupationalTableCompanyAdmin";
import { useState } from "react";
import OccupationalTableIndividualAdmin from "./OccupationalTableIndividualAdmin";

const OccupationalTables = ({
  status,
  motherTab,
  childTab,
  handleSelectChildTab,
}) => {
  return (
    <Row>
      <Col>
        <Tabs
          activeKey={childTab}
          onSelect={handleSelectChildTab}
          unmountOnExit
        >
          <Tab eventKey={"individual"} title="INDIVIDUAL">
            <OccupationalTableIndividualAdmin
              status={status}
              activeTab={childTab}
              motherTab={motherTab}
            />
            {/* <AdminTable status={status} /> */}
          </Tab>
          <Tab eventKey={"company"} title="COMPANY">
            <OccupationalTableAdmin
              status={status}
              activeTab={childTab}
              motherTab={motherTab}
            />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};
export default OccupationalTables;
