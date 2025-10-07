import React, { useEffect, useState } from 'react'
import NotificationMessageNewRequest from './NotificationMessageNewRequest'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getUnreadUserNotifications, getAllUserNotifications } from 'features/notifications/userNotificationsSlice';
import { getRequestDetailsList } from 'features/request/requestDetailsSlice';
import { requestModalSlice } from 'features/modal/requestModalSlice';
import RequestDetails from 'components/Modals/RequestDetails';
const NewRequestNotification = (props) => {
  const dispatch = useDispatch()

  const pusher = useSelector((state) => state.pusher.pusherData)
  const userDetails = useSelector((state) => state.user)
  const requestParams = useSelector((state) => state.requestFilter.params)
  const notificationParams = useSelector((state) => state.notificationFilter.params)
  const requestModal = useSelector((state) => state.requestModal);
  const modalServiceRequestData = useSelector((state) => state.requestModal.modalData);
  const [modalServiceRequest, setModalServiceRequest] = useState(false)

  const setModalServiceRequestData = (data) => {
    dispatch(requestModalSlice.actions.setModalData(data))
  }
  const toggleModalServiceRequest = (data) => {
    setModalServiceRequestData(data)
    dispatch(requestModalSlice.actions.toggleModal())
  };

  const notifyNewRequest = (data) => {
    toast.info(<NotificationMessageNewRequest props={data} />, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClick: () => {
        dispatch(requestModalSlice.actions.closeModal());
        toggleModalServiceRequest(data);
      }
    });
  }

  useEffect(() => {
    if (pusher) {
      if (userDetails.role === 'Administrator') {
        var requestServicesChannel = pusher.subscribe('private-ServiceRequest.Administrator')
        requestServicesChannel.bind('NewServiceRequested', function (data) {
          notifyNewRequest(data.request)
          // dispatch(requestDetailsSlice.actions.addItem(data.request))
          dispatch(getRequestDetailsList({ 'history': props.history, 'filter': requestParams }))
          dispatch(getUnreadUserNotifications({ 'history': props.history }))
          dispatch(getAllUserNotifications({
            'history': props.history,
            'filter': notificationParams
          }))
          // getRequestDetails()
        });
      }
      else if (userDetails.role === 'Division Head' || userDetails.role === 'Section Head' || userDetails.role === 'Assistant Section Head') {
        var updateStatusChannel = pusher.subscribe('private-ServiceRequest.Division.' + userDetails.division.divisions_id);
        updateStatusChannel.bind('NewServiceRequested', function (data) {
          notifyNewRequest(data.request)
          // dispatch(requestDetailsSlice.actions.addItem(data.request))
          dispatch(getRequestDetailsList({ 'history': props.history, 'filter': requestParams }))
          dispatch(getUnreadUserNotifications({ 'history': props.history }))
          dispatch(getAllUserNotifications({
            'history': props.history,
            'filter': notificationParams
          }))
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

export default NewRequestNotification