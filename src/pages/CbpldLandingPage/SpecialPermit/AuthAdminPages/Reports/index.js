import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb";
import Filter from "./Filter";
import ReportTable from "./Table/ReportTable";
import DownloadButton from "./DownloadButton";
import { getReportByType, SpecialPermitReport } from "features/SpecialPermitReport";

const Reports = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Breadcrumb title="Special Permit" breadcrumbItem="Reports"></Breadcrumb>
          <Col xs="12">
            <Card>
              <CardBody>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <Filter
                    action={getReportByType}
                    updateFilter={SpecialPermitReport.actions.setFilters}
                  />
                  <DownloadButton />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <ReportTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reports;
