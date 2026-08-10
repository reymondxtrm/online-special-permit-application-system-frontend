import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getOfflineTransaction,
  getOfflineTransactionDetails,
  SpecialPermitAdminSlice,
} from "features/SpecialPermitAdmin";
import { getColumnsByStatus } from "./columnMapper";
import Pagination from "components/Pagination";
import DetailButton from "../Modal/DetailsButton";
import TransactionStepperModal from "../Modal/TransactionStepperModal";
function OfflineTable({ activeTab, status, toggleModal, setSelectedRow }) {
  const [detailModal, setDetailModal] = useState(false);
  const specialPermitAdmin = useSelector(
    (state) => state.specialPermitAdmin || {},
  );
  const dispatch = useDispatch();
  const columns = useMemo(() => {
    return getColumnsByStatus(status);
  }, [status]);
  const toggleDetailModal = () => {
    setDetailModal((prev) => !prev);
  };
  const permitBadgeColors = {
    "Mayors Permit": "primary",
    "Good Moral": "success",
    Event: "info",
    Motorcade: "warning",
    Parade: "danger",
    Recorrida: "dark",
    "Use of Government Property": "secondary",
    "Occupational Permit": "light",
  };
  const params = useMemo(() => {
    return {
      ...specialPermitAdmin.params,
      status: status,
      permit_type: activeTab,
    };
  }, [activeTab, status]);
  const detailClickHandle = (selectedRow) => {
    setSelectedRow(selectedRow);
    toggleDetailModal();
    dispatch(getOfflineTransactionDetails({ id: selectedRow?.id }));
  };
  return (
    <React.Fragment>
      <TransactionStepperModal
        isOpen={detailModal}
        toggle={toggleDetailModal}
        data={specialPermitAdmin?.singleOfflineTransaction?.data}
      />

      <Table bordered responsive>
        <thead>
          <tr>
            {columns.map((item, index) => (
              <th key={index}>{item.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {specialPermitAdmin?.getOfflineTransaction ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                Loading...
              </td>
            </tr>
          ) : specialPermitAdmin?.offlineTransaction?.data?.data.length ===
            0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data found
              </td>
            </tr>
          ) : (
            specialPermitAdmin?.offlineTransaction?.data?.data.map((row, i) => (
              <tr key={i}>
                <td>{row?.control_number}</td>
                <td>{row?.date + " at " + row?.time}</td>
                <td>{row?.requestor_name}</td>
                <td>
                  <Badge
                    color={
                      permitBadgeColors[row?.special_permit_type?.name] ||
                      "secondary"
                    }
                  >
                    {row?.special_permit_type?.name}
                  </Badge>
                </td>
                <td>
                  {status === "released" ? (
                    <Button
                      color="primary"
                      onClick={() => {
                        detailClickHandle(row);
                      }}
                      size="sm"
                    >
                      View Detail
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() => {
                        toggleModal();
                        setSelectedRow(row.id);
                      }}
                      size="sm"
                    >
                      Release
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Pagination
        dataProps={specialPermitAdmin.offlineTransaction.data}
        setDataProps={SpecialPermitAdminSlice.actions.setDataPropsOfflineTable}
        setShowLoading={
          SpecialPermitAdminSlice.actions.setShowLoadingOfflineTable
        }
        isLoading={specialPermitAdmin.getOfflineTransaction}
        params={params}
      />
    </React.Fragment>
  );
}

export default OfflineTable;
