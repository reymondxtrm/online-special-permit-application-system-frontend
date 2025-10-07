/* eslint-disable padded-blocks */
import React, { useEffect, useState } from "react";
import FinalReleaserTable from "../Common/FinalReleaserTable";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import DashboardFilters from "pages/Dashboard/dashboardFilters";

import Pagination from "components/Pagination";
import {
  finalReleaserSlice,
  getForFinalReleasing,
} from "features/FinalReleaser/finalReleaserSlice";
const FinalForReleasing = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.dateFilter.params);
  const params = {
    for_action: 1,
  };
  const finalReleaser = useSelector((state) => state.finalReleaser);

  useEffect(() => {
    dispatch(getForFinalReleasing(params));
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Final Releasing" breadcrumbItem="For Releasing" />
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <DashboardFilters
                    action={getForFinalReleasing}
                    forAction={1}
                    withStatus={0}
                  />
                  <FinalReleaserTable
                    data={finalReleaser}
                    tableData={finalReleaser.forAction.data}
                    displayRelease={true}
                    showDetails={false}
                    api={"api/final-releaser/release"}
                    forAction={1}
                  />
                  <Pagination
                    dataProps={finalReleaser.forAction}
                    setDataProps={
                      finalReleaserSlice.actions.setDataForReceiving
                    }
                    setShowLoading={finalReleaserSlice.actions.setShowLoading}
                    forAction={1}
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

export default FinalForReleasing;
