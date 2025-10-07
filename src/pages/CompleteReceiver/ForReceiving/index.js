/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import CompleteReceiverTable from "../Common/CompleteReceiverTable";
import DashboardFilters from "pages/Dashboard/dashboardFilters";

import Pagination from "components/Pagination";
import {
  completeReceiverSlice,
  getForCompleteReceiving,
} from "features/CompleteReceiver/completeReceiverSlice";
const CompleteForReceiving = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  const params = {
    for_action: 1,
  };

  const completeReceiver = useSelector((state) => state.completeReceiver);
  useEffect(() => {
    dispatch(getForCompleteReceiving(params));
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Complete Receiving"
            breadcrumbItem="For Receiving"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getForCompleteReceiving}
                    forAction={1}
                  />
                  <CompleteReceiverTable
                    data={completeReceiver}
                    tableData={completeReceiver.forAction.data}
                    displayReceive={true}
                    api={"api/complete-receiver/receive"}
                    buttonName={"Receive"}
                    addBusinessCode={true}
                    showDetails={false}
                  />
                  <Pagination
                    dataProps={completeReceiver.forAction}
                    setDataProps={
                      completeReceiverSlice.actions.setDataForReceiving
                    }
                    setShowLoading={
                      completeReceiverSlice.actions.setShowLoading
                    }
                    isLoading={completeReceiver.isFetching}
                    forAction={1}
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

export default CompleteForReceiving;
