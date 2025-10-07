import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getUserListControls } from 'features/user/userListSlice';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge, Tooltip } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

const UserDetailsControl = ({ modal, toggle, modalData, setModalData, history, params }) => {
  const dispatch = useDispatch();
  //Tooltips
  const [tooltipOpenResetPassword, setTooltipOpenResetPassword] = useState(false);
  const toggleToolTipResetPassword = () => setTooltipOpenResetPassword(!tooltipOpenResetPassword);

  const [tooltipOpenEnableAccess, setTooltipOpenEnableAccess] = useState(false);
  const toggleToolTipEnableAccess = () => setTooltipOpenEnableAccess(!tooltipOpenEnableAccess);

  const [tooltipOpenDisableAccess, setTooltipOpenDisableAccess] = useState(false);
  const toggleToolTipDisableAccess = () => setTooltipOpenDisableAccess(!tooltipOpenDisableAccess);
  //*********** */
  const updateUserAccess = (status, id) => {
    Swal.fire({
      title: 'Click Yes to ' + (status) + ' User Access',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: 'Updating...',
          didOpen: () => {
            Swal.showLoading()
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCancelButton: false,
          showConfirmButton: false
        });

        axios.post('api/admin/update-user-access', {
          'status': status,
          'id': id,
        }).then(res => {
          setModalData(res.data.data)
          dispatch(getUserListControls({ 'history': history }))
          Swal.fire({
            icon: 'success',
            title: 'User has been' + (status === 'Enable' ? 'Enabled' : 'Disabled'),
            showConfirmButton: false,
            timer: 1500
          }).then(function () {

          });
        }, error => {
          console.log(error.response.data.message)
          if (error.response.status === 400) {
            Swal.fire({
              icon: 'warning',
              title: error.response.data.message,
              showConfirmButton: true,
            }).then(function () {

            });
          }
          else {
            Swal.fire({
              icon: 'warning',
              title: error.response.data.message,
              showConfirmButton: true,
            }).then(function () {

            });
          }

        })
      } else {

      }
    });
  }
  const resetUserPassword = (id) => {
    Swal.fire({
      title: 'Click Yes to Reset Password',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: 'Reseting Password...',
          didOpen: () => {
            Swal.showLoading()
          },

          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCancelButton: false,
          showConfirmButton: false
        });

        axios.post('api/admin/reset-user-password', { 'id': id }).then(res => {
          Swal.fire({
            icon: 'success',
            title: 'Password reset successful',
            showConfirmButton: false,
            timer: 1500
          }).then(function () {

          });
        }, error => {

          if (error.response.status === 500) {
            Swal.fire({
              icon: 'warning',
              title: error.response.data.message,
              showConfirmButton: true,
            }).then(function () {

            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Something went wrong, please try again',
              showConfirmButton: true,
            }).then(function () {

            });
          }

        })
      } else {
        console.log('cancel');
      }
    });
  }
  return (
    <div>
      <Modal
        size='lg'
        centered
        isOpen={modal}
        toggle={() => toggle()}
        backdrop="static"
      >
        <ModalHeader toggle={() => { toggle() }} tag="h4">
          User Information
        </ModalHeader>
        <ModalBody>
          {
            modalData && (
              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">Full Name :</th>
                      <td>{modalData.first_name + ' ' + (modalData.middle_name ? (modalData.middle_name.charAt(0) + '. ') : '') + modalData.last_name + (modalData.suffix ? ', ' + modalData.suffix : '')}</td>
                    </tr>
                    <tr>
                      <th scope="row">Mobile :</th>
                      <td>{modalData.contact_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Office :</th>
                      <td>{modalData.offices.office_description}</td>
                    </tr>
                    <tr>
                      <th scope="row">User Role :</th>
                      <td>{modalData.user_roles.role}</td>
                    </tr>
                    {
                      (modalData.division_id || modalData.division_id!==0) && (
                        <tr>
                          <th scope="row">Division :</th>
                          <td>{modalData.divisions.division}</td>
                        </tr>
                      )
                    }

                    <tr>
                      <th scope="row">Position :</th>
                      <td>{modalData.position}</td>
                    </tr>
                    <tr>
                      <th scope="row">Account Status :</th>
                      <td>{
                        modalData.status_id === 1 ? (
                          <Badge color="success">
                            Approved
                          </Badge>
                        ) : modalData.status_id === 2 ? (
                          <Badge color="danger">
                            Disapproved
                          </Badge>
                        ) : modalData.status_id === 3 ? (
                          <Badge color="warning">
                            Pending
                          </Badge>
                        ) : ''
                      }</td>
                    </tr>
                    <tr>
                      <th scope="row">User Access :</th>
                      <td>{
                        modalData.is_active === 1 ? (
                          <Badge color="success">
                            Enabled
                          </Badge>
                        ) : modalData.is_active === 0 ? (
                          <Badge color="danger">
                            Disabled
                          </Badge>
                        ) : ''
                      }</td>
                    </tr>
                    <tr>
                      <th scope="row">Username :</th>
                      <td>{modalData.username}</td>
                    </tr>
                    <tr>
                      <th scope="row">Date of Registration :</th>
                      <td>{moment(modalData.created_at).format('MMMM D, YYYY')}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )
          }<br />
          <div>
            {
              <>
                {modalData && (
                  modalData.is_active === 1 ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger"
                        id="TooltipForDisableAccess"
                        onClick={() => { updateUserAccess('Disable', modalData.id) }}
                      >
                        <i className="bx bxs-user-x font-size-16 align-middle me-2"></i>{" "}
                        Disable
                      </button>
                      <Tooltip
                        isOpen={tooltipOpenDisableAccess}
                        target="TooltipForDisableAccess"
                        toggle={toggleToolTipDisableAccess}
                      >
                        Disable User Access
                      </Tooltip>
                    </>
                  ) : modalData.is_active === 0 ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-success"
                        id="TooltipForEnableAccess"
                        onClick={() => { updateUserAccess('Enable', modalData.id) }}
                      >
                        <i className="bx bxs-user-check font-size-16 align-middle me-2"></i>{" "}
                        Enable
                      </button>

                      <Tooltip
                        isOpen={tooltipOpenEnableAccess}
                        target="TooltipForEnableAccess"
                        toggle={toggleToolTipEnableAccess}
                      >
                        Enable User Access
                      </Tooltip>
                    </>
                  ) : '')
                }
                {" "}
                <button
                  type="button"
                  className="btn btn-warning"
                  id="TooltipForResetPassword"
                  onClick={() => { resetUserPassword(modalData.id) }}
                >
                  <i className="bx bx-lock-open font-size-16 align-middle me-2"></i>{" "}
                  Reset Password
                </button>
                <Tooltip
                  isOpen={tooltipOpenResetPassword}
                  target="TooltipForResetPassword"
                  toggle={toggleToolTipResetPassword}
                >
                  Default password will be (12345678)
                </Tooltip>
              </>

            }

          </div>

        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => { toggle() }}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default UserDetailsControl