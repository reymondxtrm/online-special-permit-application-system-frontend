/* eslint-disable padded-blocks */
import React, { useEffect } from "react";
import AssessmentReleaserTable from "../Common/AssessmentReleaserTable";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";

import Pagination from "components/Pagination";
import {
  assessmentReleaserSlice,
  getAssessmentReleased,
} from "features/AssessmentReleaser/assessmentReleaserSlice";
const AssessmentReleaserDashboard = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);

  const assessmentReleaser = useSelector((state) => state.assessmentReleaser);
  useEffect(() => {
    dispatch(getAssessmentReleased());
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Assessment Releasing"
            breadcrumbItem="Dashboard"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getAssessmentReleased}
                    forAction={0}
                  />
                  <AssessmentReleaserTable
                    data={assessmentReleaser}
                    tableData={assessmentReleaser.assessmentReleased.data}
                    displayRelease={false}
                    assessment_releaser={true}
                    showAging={true}
                    showDetails={true}
                  />
                  <Pagination
                    dataProps={assessmentReleaser.assessmentReleased}
                    setDataProps={assessmentReleaserSlice.actions.setDataProps}
                    setShowLoading={
                      assessmentReleaserSlice.actions.setShowLoading
                    }
                    forAction={0}
                    isLoading={assessmentReleaser.isFetching}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AssessmentReleaserDashboard;
