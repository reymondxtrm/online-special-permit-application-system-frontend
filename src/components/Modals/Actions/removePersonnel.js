import React from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { getRequestDetailsList } from 'features/request/requestDetailsSlice'
import { useDispatch, useSelector } from 'react-redux'
const RemovePersonnel = ({ personnelId, requestId, setModalData }) => {
  const dispatch = useDispatch()
  const requestParams = useSelector((state) => state.requestFilter.params)
  const userRole = useSelector((state) => state.user.role)
  const remove = (id) => {
    Swal.fire({
      title: 'Click Yes to Remove Personnel',
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
          title: 'Processing...',
          didOpen: () => {
            Swal.showLoading()
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCancelButton: false,
          showConfirmButton: false
        });

        axios.post('api/admin/remove-personnel', {
          'personnelId': personnelId,
          'requestId': requestId
        }).then(res => {
          setModalData(res.data)
          Swal.fire({
            icon: 'success',
            title: 'Personnel Successfully Removed',
            showConfirmButton: false,
            timer: 1500
          }).then(function () {
            dispatch(getRequestDetailsList({ 'history': history, 'filter': requestParams }))
          });
        }, error => {
          console.log(error.response.data.message)
          if (error.response.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: error.response.data.message,
              showConfirmButton: true,
            }).then(function () {

            });
          }
          else if (error.response.status === 400) {
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
    (userRole === 'Administrator' || userRole === 'Division Head') && (
      <i style={{ fontSize: '11px', color: "#f46a6a", cursor: 'pointer', position: 'relative', top: '1px' }} className="fas fa-times-circle" onClick={() => remove(personnelId)}></i>
    )
  )
}

export default RemovePersonnel