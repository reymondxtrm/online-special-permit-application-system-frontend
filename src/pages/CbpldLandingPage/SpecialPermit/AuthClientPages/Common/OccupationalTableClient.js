import { getCompanyOccupatinalData } from "features/SpecialPermitClient";
import ParadeModal from "pages/CbpldLandingPage/Modals/ParadeModal";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";

export default function OccupationalTableClient() {
  const dispatch = useDispatch();
  const tableData = useSelector((state) => state.specialPermitClient);
  useEffect(() => {
    dispatch(getCompanyOccupatinalData({ type: "company" }));
  }, []);
  console.log(tableData);
  return <Table></Table>;
}
