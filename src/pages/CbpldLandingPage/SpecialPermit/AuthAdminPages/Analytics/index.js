import Breadcrumb from "components/Common/Breadcrumb";
import ColumnWithDataLabels from "pages/AllCharts/apex/ColumnWithDataLabels";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  InputGroup,
  Label,
  Row,
  Table,
} from "reactstrap";
import Apaexlinecolumn from "pages/AllCharts/apex/apaexlinecolumn";
import Filters from "./Filter";
import {
  getSpecialPermitAnalyticsData,
  SpecialPermitAdminSlice,
} from "features/SpecialPermitAdmin";
import DashedLine from "pages/AllCharts/apex/dashedLine";
import { getReportByType } from "features/SpecialPermitReport";
import DownloadButton from "./DownloadButton";

const Analytics = () => {
  const dispatch = useDispatch();

  const analyticsData = useSelector((state) => state.specialPermitAdmin);
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const date_from = startOfMonth.toISOString().split("T")[0];
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const date_to = endOfMonth.toISOString().split("T")[0];

  useEffect(() => {
    dispatch(
      getSpecialPermitAnalyticsData({
        type: { value: 2, label: "Good Moral" },
        date_from,
        date_to,
      }),
    );
    dispatch(
      SpecialPermitAdminSlice.actions.setFilters({
        type: { value: 2, label: "Good Moral" },
        date_from,
        date_to,
      }),
    );
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Breadcrumb title="Analytics"></Breadcrumb>
          <Col md="9">
            <Card>
              <CardBody>
                <div className="d-flex align-items-center gap-2">
                  <Filters
                    action={getSpecialPermitAnalyticsData}
                    updateFilter={SpecialPermitAdminSlice.actions.setFilters}
                  />
                  <DownloadButton />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Good Moral</CardTitle>

                <DashedLine
                  countSeries={analyticsData?.analyticsData?.total_applications}
                  days={analyticsData?.analyticsData?.day}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Count By Purpose</CardTitle>
                <Apaexlinecolumn
                  purposeSeries={analyticsData?.analyticsData?.count_by_purpose}
                  dates={analyticsData?.analyticsData?.purpose_date}
                />
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title rounded-circle bg-primary bg-soft text-primary font-size-18">
                      <i className={"mdi mdi-clock"} />
                    </span>
                  </div>
                  <h5 className="font-size-14 mb-0">
                    Average Transaction Time Duration
                  </h5>
                </div>
                <div className="text-muted mt-4">
                  <h4>
                    {/* {report?.value || 10}{" "} */}
                    {analyticsData.analyticsData.average}
                    {/* <i className="mdi mdi-chevron-up ms-1 text-success" /> */}
                  </h4>
                  <div className="d-flex">
                    <span
                      className={
                        "badge badge-soft-" + "primary" + " font-size-12"
                      }
                    >
                      {" "}
                      {analyticsData.analyticsData.total_number_transaction}
                    </span>{" "}
                    <span className="ms-2 text-truncate">transaction</span>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody></CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Analytics;
