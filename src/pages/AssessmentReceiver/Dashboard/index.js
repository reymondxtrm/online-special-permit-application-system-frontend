/* eslint-disable padded-blocks */
import React, { useEffect } from "react";
import AssessmentReceiverTable from "../Common/AssessmentReceiverTable";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";

import Pagination from "components/Pagination";
import {
  assessmentReceiverSlice,
  getAssessmentReceived,
} from "features/AssessmentReceiver/assessmentReceiverSlice";
const AssessmentReceiverDashboard = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);

  const assessmentReceiver = useSelector((state) => state.assessmentReceiver);
  useEffect(() => {
    dispatch(getAssessmentReceived());
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Assessment Receiving"
            breadcrumbItem="Dashboard"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getAssessmentReceived}
                    forAction={0}
                  />
                  <AssessmentReceiverTable
                    data={assessmentReceiver}
                    tableData={assessmentReceiver.assessmentReceived.data}
                    displayRelease={false}
                    assessment_receiver={true}
                    showAging={true}
                    showDetails={true}
                  />
                  <Pagination
                    dataProps={assessmentReceiver.assessmentReceived}
                    setDataProps={assessmentReceiverSlice.actions.setDataProps}
                    setShowLoading={
                      assessmentReceiverSlice.actions.setShowLoading
                    }
                    isLoading={assessmentReceiver.isFetching}
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

export default AssessmentReceiverDashboard;
