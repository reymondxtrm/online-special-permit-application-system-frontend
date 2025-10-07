import TableLoaders from "components/Loaders/TableLoaders";
import {
  finalReleaserSlice,
  getForPrinting,
} from "features/FinalReleaser/finalReleaserSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Container, Table } from "reactstrap";
import Swal from "sweetalert2";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useEffect } from "react";
import FinalReleaserTable from "../Common/FinalReleaserTable";
import DashboardFilters from "pages/Dashboard/dashboardFilters";
import Pagination from "components/Pagination";

const ForPrinting = () => {
  const params = { for_action: 2 };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getForPrinting(params));
  }, []);
  const finalReleaser = useSelector((state) => state.finalReleaser);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Final Releasing" breadcrumbItem="For Printing" />
        <Card>
          <CardBody>
            <DashboardFilters
              action={(params) => getForPrinting(params)}
              forAction={2}
              withStatus={0}
            />
            <FinalReleaserTable
              data={finalReleaser}
              tableData={finalReleaser.forPrinting.data}
              forAction={2}
              displayRelease={false}
              api={"api/final-releaser/print"}
              displayEdit={false}
              showAging={false}
              showDetails={false}
            />

            <Pagination
              dataProps={finalReleaser.forPrinting}
              setDataProps={finalReleaserSlice.actions.setDataForPrinting}
              setShowLoading={finalReleaserSlice.actions.setShowLoading}
              forAction={2}
              isLoading={finalReleaser.isFetching}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ForPrinting;
