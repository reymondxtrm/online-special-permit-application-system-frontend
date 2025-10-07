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
  getForAssessmentReceiving,
} from "features/AssessmentReceiver/assessmentReceiverSlice";
const AssessmentForReceiving = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  const params = {
    for_action: 1,
  };

  const assessmentReceiver = useSelector((state) => state.assessmentReceiver);
  useEffect(() => {
    dispatch(getForAssessmentReceiving(params));
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Assessment Receiving"
            breadcrumbItem="For Receiving"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getForAssessmentReceiving}
                    forAction={1}
                  />
                  <AssessmentReceiverTable
                    data={assessmentReceiver}
                    tableData={assessmentReceiver.forAction.data}
                    displayRelease={true}
                    api={"api/assessment-receiver/receive"}
                    showAging={false}
                    showDetails={false}
                  />
                  <Pagination
                    dataProps={assessmentReceiver.forAction}
                    setDataProps={
                      assessmentReceiverSlice.actions.setDataForReceiving
                    }
                    setShowLoading={
                      assessmentReceiverSlice.actions.setShowLoading
                    }
                    forAction={1}
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

export default AssessmentForReceiving;
