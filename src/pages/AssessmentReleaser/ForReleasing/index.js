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
  getForAssessmentReleasing,
} from "features/AssessmentReleaser/assessmentReleaserSlice";
const AssessmentForReleasing = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  const params = {
    for_action: 1,
  };

  const assessmentReleaser = useSelector((state) => state.assessmentReleaser);
  useEffect(() => {
    dispatch(getForAssessmentReleasing(params));
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Assessment Releasing"
            breadcrumbItem="For Releasing"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getForAssessmentReleasing}
                    forAction={1}
                  />
                  <AssessmentReleaserTable
                    data={assessmentReleaser}
                    tableData={assessmentReleaser.forAction.data}
                    displayRelease={true}
                    api={"api/assessment-releaser/release"}
                    refreshTableFunction={getForAssessmentReleasing(params)}
                    showDetails={false}
                  />
                  <Pagination
                    dataProps={assessmentReleaser.forAction}
                    setDataProps={
                      assessmentReleaserSlice.actions.setDataForReceiving
                    }
                    setShowLoading={
                      assessmentReleaserSlice.actions.setShowLoading
                    }
                    forAction={1}
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

export default AssessmentForReleasing;
