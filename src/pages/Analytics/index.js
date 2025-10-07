import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Badge,
  Button,
  Placeholder,
  CardHeader,
  CardTitle,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import BarChart from "../AllCharts/chartjs/barchart";
import PieChart from "pages/AllCharts/chartjs/piechart";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import { getAnalyticsData } from "features/Analytics/analyticsSlice";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./Filters";
import ActivityComp from "pages/Dashboard/ActivityComp";
const Analytics = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAnalyticsData());
  }, []);
  const data = useSelector((state) => state.analytics.analyticsData);

  const dummyData = [{ SO: 3 }, { ST: 12 }, { CE: 44 }, { CA: 4 }, { MS: 21 }];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="Analytics" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Filters action={getAnalyticsData} />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* <Row>
            <ActivityComp />
          </Row> */}
          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">MALE</CardTitle>
                  <BarChart
                    legendTitle={"Number"}
                    barColor={"#211d70"}
                    count={dummyData}
                    sample={data.gender ? data.gender.male : null}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">FEMALE</CardTitle>
                  <BarChart
                    legendTitle={"Number"}
                    barColor={"#d74620"}
                    sample={data.gender ? data.gender.female : null}
                    count={data.gender ? data.gender.female : null}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* <UserDetails modal={userModal.modal} setModal={setModal} toggle={toggle} modalData={modalData} setModalData={setModalData} history={props.history} params={validation.values}/> */}
      </div>
    </React.Fragment>
  );
};

export default Analytics;
