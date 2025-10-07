/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import InitialReceiverTable from "../Common/InitialReceiverTable";

import {
  getInitialReceived,
  initialReceiverSlice,
} from "features/InitialReceiver/initialReceiverSlice";

import Pagination from "components/Pagination";
const InitialReceiverDashboard = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  const [watcher, setWatcher] = useState(false);
  const updateWatcher = () => setWatcher(!watcher);
  const initialReceiver = useSelector((state) => state.initialReceiver);
  useEffect(() => {
    dispatch(getInitialReceived());
  }, [watcher]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Initial Receiving" breadcrumbItem="Dashboard" />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters action={getInitialReceived} forAction={0} />
                  <InitialReceiverTable
                    data={initialReceiver}
                    tableData={initialReceiver.initialReceived.data}
                    displayDetails={true}
                    displayEdit={true}
                    action={updateWatcher}
                  />
                  <Pagination
                    dataProps={initialReceiver.initialReceived}
                    setDataProps={initialReceiverSlice.actions.setDataProps}
                    setShowLoading={initialReceiverSlice.actions.setShowLoading}
                    isLoading={initialReceiver.isFetching}
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

export default InitialReceiverDashboard;
