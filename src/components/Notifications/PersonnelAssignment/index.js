import React, { useEffect, useState } from 'react'
import NotificationMessagePersonnelAssignment from './NotificationMessagePersonnelAssignment';
import { useSelector, useDispatch } from 'react-redux';
import RequestDetails from 'components/Modals/RequestDetails';
import { toast } from 'react-toastify';
import { requestModalSlice } from 'features/modal/requestModalSlice';
import { getRequestDetailsList } from 'features/request/requestDetailsSlice';
import { getSpecificRequestDetails } from 'features/modal/requestModalSlice';
import { getUnreadUserNotifications, getAllUserNotifications } from 'features/notifications/userNotificationsSlice';
const PersonnelAssignmentNotification = (props) => {
  const dispatch = useDispatch()
  const pusher = useSelector((state) => state.pusher.pusherData)
  const userDetails = useSelector((state) => state.user)
  const requestParams = useSelector((state) => state.requestFilter.params)
  const notificationParams = useSelector((state) => state.notificationFilter.params)
  const requestModal = useSelector((state) => state.requestModal);
  const modalServiceRequestData = useSelector((state) => state.requestModal.modalData);
  const [modalServiceRequest, setModalServiceRequest] = useState(false)

  const setModalServiceRequestData = (data) => {
    dispatch(getSpecificRequestDetails({ 'data': data.request_details_id }))
    // dispatch(requestModalSlice.actions.setModalData(data))
  }
  const toggleModalServiceRequest = (data) => {
    setModalServiceRequestData(data)
    dispatch(requestModalSlice.actions.toggleModal())
  };

  const getRequestDetails = () => {
    dispatch(getRequestDetailsList({ 'history': history, 'filter': requestParams }))
  }
  const notifyPersonnelAssignment = (data) => {
    toast.info(<NotificationMessagePersonnelAssignment props={data} />, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClick: () => {
        dispatch(requestModalSlice.actions.closeModal());
        toggleModalServiceRequest(data)
      }
    });
  }

  useEffect(() => {
    if (pusher) {
      if (userDetails.role === 'Administrator') {
        var assignmentStatusChannel = pusher.subscribe('private-ServiceRequestAssignment.Administrator');
        assignmentStatusChannel.bind('AssignmentServiceRequest', function (data) {
          notifyPersonnelAssignment(data.request)
          dispatch(getUnreadUserNotifications({ 'history': props.history }))
          dispatch(getAllUserNotifications({
            'history': props.history,
            'filter': notificationParams
          }))
          getRequestDetails()
        });
      }
      else if (userDetails.role === 'Requestor') {
        var assignmentStatusChannel = pusher.subscribe('private-ServiceRequestAssignment.Requestor.' + userDetails.user_name);
        assignmentStatusChannel.bind('AssignmentServiceRequest', function (data) {
          notifyPersonnelAssignment(data.request)
          dispatch(getUnreadUserNotifications({ 'history': props.history }))
          dispatch(getAllUserNotifications({
            'history': props.history,
            'filter': notificationParams
          }))
          getRequestDetails()
        });
      }
      else if (userDetails.role === 'Division Head' || userDetails.role === 'Section Head' || userDetails.role === 'Assistant Section Head') {
        var assignmentStatusChannel = pusher.subscribe('private-ServiceRequestAssignment.Division.' + userDetails.division.divisions_id);
        assignmentStatusChannel.bind('AssignmentServiceRequest', function (data) {
          notifyPersonnelAssignment(data.request)
          dispatch(getUnreadUserNotifications({ 'history': props.history }))
          dispatch(getAllUserNotifications({
            'history': props.history,
            'filter': notificationParams
          }))
          getRequestDetails()
        });
      }
      else if (userDetails.role === 'Personnel') {
        var assignmentStatusChannel = pusher.subscribe('private-ServiceRequestAssignment.Personnel.' + userDetails.id);
        assignmentStatusChannel.bind('AssignmentServiceRequest', function (data) {
          notifyPersonnelAssignment(data.request)
          dispatch(getUnreadUserNotifications({ 'history': props.history }))
          dispatch(getAllUserNotifications({
            'history': props.history,
            'filter': notificationParams
          }))
          getRequestDetails()
        });
      }
    }

  }, [pusher, userDetails, notificationParams])
  return (
    <div>

      <RequestDetails modal={requestModal.modal} setModal={setModalServiceRequest} toggle={toggleModalServiceRequest} modalData={modalServiceRequestData} setModalData={setModalServiceRequestData} history={props.history} />
    </div>
  )
}

export default PersonnelAssignmentNotification