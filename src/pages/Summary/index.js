/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import axios from "axios";
import SummaryTable from "pages/Summary/common/SummaryTable";
import ExportButton from "./common/ExportButton";

import Pagination from "components/Pagination";
import { summarySlice, getSummary } from "features/Summary/summarySlice";
const Summary = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  // const params = {
  //   for_action: 1,
  // };

  const [statusOptions, setStatusOptions] = useState();
  const summary = useSelector((state) => state.summary);

  const checkStatus = (status) => {
    if (status === "initial_received") {
      return "Initial Received";
    }
    if (status === "assessment_received") {
      return "Assessment Received";
    }
    if (status === "assessment_released") {
      return "Assessment Released";
    }
    if (status === "complete_received") {
      return "Complete Received";
    }
    if (status === "final_released") {
      return "Final Released";
    }
  };

  useEffect(() => {
    dispatch(getSummary());
  }, []);

  useEffect(() => {
    axios.get("api/stages").then(
      (res) => {
        const options = res.data.map((options) => ({
          value: options.name,
          label: checkStatus(options.name),
        }));
        setStatusOptions(options);
      },
      (error) => {}
    );
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="Summary" />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getSummary}
                    forAction={1}
                    withStatus={1}
                    statuses={statusOptions}
                    withExport={true}
                  />
                  {/* <div>
                    <ExportButton />
                  </div> */}
                  <SummaryTable
                    data={summary}
                    tableData={summary.summaryDashboard.data}
                  />
                  <Pagination
                    dataProps={summary.summaryDashboard}
                    setDataProps={summarySlice.actions.setDataProps}
                    setShowLoading={summarySlice.actions.setShowLoading}
                    forAction={0}
                    isLoading={summary.isFetching}
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

export default Summary;
