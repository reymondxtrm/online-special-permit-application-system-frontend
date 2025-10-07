import React, { useState } from 'react'
import { Table, Button } from 'reactstrap';
import UpdateStatusModal from 'components/Modals/Actions/updateStatus';
import ForwardRequestModal from 'components/Modals/Actions/forwardRequest';
import AssignPersonnelModal from 'components/Modals/Actions/assignPersonnel';
import CancelRequestModal from 'components/Modals/Actions/cancelRequest';
const RequestActionsModalTable = ({
  modalData,
  setModalData,
  params
}) => {
  //Actions Modals//
  const [modalAssignPersonnel, setModalAssignPersonnel] = useState(false)
  const toggleModalAssignPersonnel = () => {
    setModalAssignPersonnel(!modalAssignPersonnel)
  };

  const [modalForwardRequest, setModalForwardRequest] = useState(false)
  const toggleModalForwardRequest = () => {
    setModalForwardRequest(!modalForwardRequest)
  };

  const [modalUpdateStatus, setModalUpdateStatus] = useState(false)
  const toggleModalUpdateStatus = () => {
    setModalUpdateStatus(!modalUpdateStatus)
  };

  const [modalCancelRequest, setModalCancelRequest] = useState(false)
  const toggleModalCancelRequest = () => {
    setModalCancelRequest(!modalCancelRequest)
  }
  //**End */
  return (
    <>
      <Table responsive className="table mb-0">
        <tbody>
          <tr>
            <th scope="row">Forward/Escalate:</th>
            <td><Button onClick={toggleModalForwardRequest}>Forward</Button></td>

            <th scope="row">Update Status:</th>
            <td><Button onClick={toggleModalUpdateStatus}>Update</Button></td>
          </tr>
          <tr>
            <th scope="row">Assign Personnel:</th>
            <td><Button onClick={toggleModalAssignPersonnel}>Assign</Button></td>
            {
              !modalData.is_cancelled && (
                <>
                  <th scope="row">Cancel Request:</th>
                  <td><Button onClick={toggleModalCancelRequest}>Cancel</Button></td>
                </>
              )
            }
          </tr>
        </tbody>
      </Table>
      <UpdateStatusModal modal={modalUpdateStatus} toggle={toggleModalUpdateStatus} modalData={modalData} setModalData={setModalData} history={history} params={params} />

      <ForwardRequestModal modal={modalForwardRequest} toggle={toggleModalForwardRequest} modalData={modalData} setModalData={setModalData} history={history} params={params} />

      <AssignPersonnelModal modal={modalAssignPersonnel} toggle={toggleModalAssignPersonnel} modalData={modalData} setModalData={setModalData} history={history} params={params} />

      <CancelRequestModal modal={modalCancelRequest} toggle={toggleModalCancelRequest} modalData={modalData} setModalData={setModalData} history={history} params={params} />
    </>
  )
}

export default RequestActionsModalTable