import TableLoaders from "components/Loaders/TableLoaders";
import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import RecordDetailsModal from "./RecordDetailsModal";

export default function AllPermitReceivers({ businessId, toggle }) {
  //show the table of permit receivers
  const [tableData, setTableData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [InfoModal, setInfoModal] = useState(false);
  const [selectedReceiverDetails, setSelectedReceiverRecords] = useState(null);

  const showRecordDetailModal = () => {
    setInfoModal((prev) => !prev);
  };
  useEffect(() => {
    setIsFetching(true);
    axios
      .get(`api/releasing-data`, {
        params: {
          business_id: businessId,
        },
      })
      .then((response) => {
        setTableData(response.data.data);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log(error.response);
      });
  }, []);

  const handleShowDetailModal = (item) => {
    Swal.fire({
      title: "Fetching Data",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    setSelectedReceiverRecords(item);

    axios
      .get(`api/receiver-images`, {
        params: {
          id: item.receiver_id,
        },
      })
      .then((res) => {
        setSelectedReceiverRecords((prev) => {
          return {
            ...prev,
            receiver_signature: res.data.signature,
            receiver_photo: res.data.photo,
          };
        });
        showRecordDetailModal();
        Swal.close();
        // console.log(res);
      })
      .catch((error) => {
        console.log(error.response.data);
        Swal.close();
        Swal.fire({
          icon: "warning",
          title: "No records found in releasing",
          showConfirmButton: false,
          timer: 2000,
        }).then(function () {});
      });
  };

  return (
    <div>
      <Modal
        isOpen={InfoModal}
        toggle={showRecordDetailModal}
        className="border-0"
      >
        <ModalBody
          style={{
            background: "linear-gradient(to bottom, #FFFFFF, #8EBFE1)",
            padding: "20px",
            color: "white",
          }}
        >
          <RecordDetailsModal selectedRecord={selectedReceiverDetails} />
        </ModalBody>
        <ModalFooter
          style={{ backgroundColor: "#5271FF" }}
          className="text-center"
        >
          <Button color="success" onClick={showRecordDetailModal}>
            Okay
          </Button>
        </ModalFooter>
      </Modal>
      <Table bordered responsive hover>
        <thead>
          <tr>
            <th
              style={{
                width: "10%",
                cursor: "pointer",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              Released Date
            </th>

            <th
              style={{
                width: "15%",
                cursor: "pointer",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              Receiver Name
            </th>
            <th
              style={{
                width: "5%",
                cursor: "pointer",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <TableLoaders row={5} />
          ) : tableData.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No Data
              </td>
            </tr>
          ) : (
            Object.entries(tableData).map(([key, item]) => {
              return (
                <tr key={key}>
                  {/* <td>
                    <Badge className="p-1" color="success">
                      {" "}
                      {item.released_at}{" "}
                    </Badge>
                  </td> */}
                  <td>{item.released_at}</td>
                  {/* <td>{item.business_name}</td> */}
                  <td>{item.receiver_name}</td>
                  <td className="text-center">
                    <Button
                      onClick={() => {
                        handleShowDetailModal(item);
                      }}
                      className="btn btn-warning"
                    >
                      <i className="fas fa-info-circle"></i>
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
      {/* <Button color="primary" onClick={toggle} className="text-end ">
        Okay
      </Button> */}
    </div>
  );
}
