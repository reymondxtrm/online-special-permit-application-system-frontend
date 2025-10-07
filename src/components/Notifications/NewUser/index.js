import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import UserDetails from 'components/Modals/UserDetails'
import { useSelector, useDispatch } from 'react-redux'
import NotificationMessageNewUser from './NotificationMessageNewUser'
import { getUserList } from 'features/user/userListSlice'
import { getUnreadUserNotifications, getAllUserNotifications } from 'features/notifications/userNotificationsSlice'
import { userModalSlice } from 'features/modal/userModalSlice';
const NewUserNotification = (props) => {
  const dispatch = useDispatch()
  const pusher = useSelector((state) => state.pusher.pusherData)
  const notificationParams = useSelector((state) => state.notificationFilter.params)
  const userDetails = useSelector((state) => state.user)
  const userModal = useSelector((state) => state.userModal)
  const [modalUserVerification, setModalUserVerification] = useState(false);
  // const [modalUserVerificationData, setModalUserVerificationDataData] = useState()
  const modalUserVerificationData = useSelector((state) => state.userModal.modalData)
  const setModalUserVerificationDataData = (data) => {
    dispatch(userModalSlice.actions.setModalData(data))
  }
  const toggleModalUserVerification = (data) => {
    setModalUserVerificationDataData(data)
    dispatch(userModalSlice.actions.toggleModal())
  };

  const notify = (data) => {
    toast.success(<NotificationMessageNewUser props={data} />, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClick: () => {
        dispatch(userModalSlice.actions.closeModal());
        toggleModalUserVerification(data)
      }
    });
  }
  useEffect(() => {
    if (pusher) {
      if (userDetails.role === 'Administrator') {
        var privateChannel = pusher.subscribe('private-UserSignUp');
        privateChannel.bind('NewUserSignedUp', function (data) {
          notify(data.request)
          dispatch(getUserList({ 'history': props.history }));
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
      <UserDetails modal={userModal.modal} setModal={setModalUserVerification} toggle={toggleModalUserVerification} modalData={modalUserVerificationData} setModalData={setModalUserVerificationDataData} history={props.history} />
    </div>
  )
}

export default NewUserNotification