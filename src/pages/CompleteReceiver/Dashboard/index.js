/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import CompleteReceiverTable from "../Common/CompleteReceiverTable";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";

import Pagination from "components/Pagination";
import {
  completeReceiverSlice,
  getCompleteReceived,
} from "features/CompleteReceiver/completeReceiverSlice";
const CompleteReceiverDashboard = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);

  const [watcher, setWatcher] = useState(false);
  const updateWatcher = () => setWatcher(!watcher);

  const completeReceiver = useSelector((state) => state.completeReceiver);
  useEffect(() => {
    dispatch(getCompleteReceived());
  }, [watcher]);

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
                    action={getCompleteReceived}
                    forAction={0}
                  />
                  <CompleteReceiverTable
                    data={completeReceiver}
                    tableData={completeReceiver.completeReceived.data}
                    displayReceive={false}
                    complete_receiver={false}
                    showAging={false}
                    displayEdit={true}
                    showDetails={true}
                    action={updateWatcher}
                  />
                  <Pagination
                    dataProps={completeReceiver.completeReceived}
                    setDataProps={completeReceiverSlice.actions.setDataProps}
                    setShowLoading={
                      completeReceiverSlice.actions.setShowLoading
                    }
                    isLoading={completeReceiver.isFetching}
                    forAction={0}
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

export default CompleteReceiverDashboard;
