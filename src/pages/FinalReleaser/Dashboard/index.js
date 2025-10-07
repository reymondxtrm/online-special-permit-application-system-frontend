/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import FinalReleaserTable from "../Common/FinalReleaserTable";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  UncontrolledDropdown,
  UncontrolledCollapse,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import AdvanceSearch from "components/Filters/AdvanceSearch";
import Pagination from "components/Pagination";
import {
  finalReleaserSlice,
  getFinalReleased,
} from "features/FinalReleaser/finalReleaserSlice";
import { dateFilterSlice } from "features/filters/dateFilterSlice";

const FinalReleaserDashboard = () => {
  const dispatch = useDispatch();
  const [watcher, setWatcher] = useState(false);
  const updateWatcher = () => setWatcher(!watcher);
  const finalReleaser = useSelector((state) => state.finalReleaser);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const mode = useSelector((state) => state.dateFilter.searchMode);
  useEffect(() => {
    dispatch(getFinalReleased());
  }, [watcher]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Final Releasing" breadcrumbItem="Dashboard" />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  {mode === 0 ? (
                    <DashboardFilters action={getFinalReleased} forAction={0} />
                  ) : null}

                  <Button
                    style={{ marginTop: "3px" }}
                    id="toggler"
                    color="primary"
                    onClick={() => {
                      setShowAdvanceSearch((prev) => !prev);
                      dispatch(dateFilterSlice.actions.setSearchMode());
                    }}
                  >
                    {mode === 0 ? "Advance Search" : "Simple search"}
                  </Button>
                  <UncontrolledCollapse toggler="#toggler">
                    <AdvanceSearch action={getFinalReleased} forAction={0} />
                  </UncontrolledCollapse>

                  <FinalReleaserTable
                    data={finalReleaser}
                    tableData={finalReleaser.finalReleased.data}
                    displayRelease={false}
                    showAging={true}
                    showDetails={true}
                    displayEdit={true}
                    action={updateWatcher}
                  />
                  <Pagination
                    dataProps={finalReleaser.finalReleased}
                    setDataProps={finalReleaserSlice.actions.setDataProps}
                    setShowLoading={finalReleaserSlice.actions.setShowLoading}
                    forAction={0}
                    isLoading={finalReleaser.isFetching}
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

export default FinalReleaserDashboard;
