import React, { useEffect } from 'react'
import NewRequestNotification from './NewRequest'
import UpdateRequestNotification from './UpdateRequest'
import NewUserNotification from './NewUser';
import { ToastContainer, Flip } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { pusherSlice } from 'features/pusher/pusherSlice';
import axios from 'axios';
import ForwardRequestNotification from './ForwardRequest';
import PersonnelAssignmentNotification from './PersonnelAssignment';
import { onlineUserSlice } from 'features/user/onlineUserSlice';
const Pusher = require('pusher-js')
const Notifications = () => {
  const dispatch = useDispatch()
  //***Pusher Config */
  const pusher = useSelector((state) => state.pusher.pusherData)
  const userDetails = useSelector((state) => state.user)
  const currentUserID = useSelector((state) => state.user.id)
  useEffect(() => {
    if (userDetails.role) {
      var pusherData = new Pusher('71fcd3ee8db6ebc1d96e', {
        cluster: 'ap1',
        enabledTransports: ['ws', 'wss'],
        auth: {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
          }
        },
        authEndpoint: window.location.protocol + '//' + process.env.REACT_APP_API + '/broadcasting/auth'
      })
      pusherData.connection.bind("connected", () => {
        axios.defaults.headers.post['X-Socket-ID'] = pusherData.connection.socket_id;
      });
      dispatch(pusherSlice.actions.setPusherData({ pusherData }))
    }

    else {
      if (pusher) {
        pusher.allChannels().map((channel) => {
          pusher.unsubscribe(channel.name)
        })
      }
    }
  }, [userDetails.role])
  //**End */
  useEffect(() => {
    if (pusher) {
      var presenceChannel = pusher.subscribe('presence-OnlineUser.1');
      if (userDetails.role === 'Administrator') {
        presenceChannel.bind('pusher:subscription_succeeded', function (data) {
          const users = Object.entries(presenceChannel.members.members).filter((user) => user[1].id !== currentUserID)
          dispatch(onlineUserSlice.actions.setOnlineUsers(users))
        });
        presenceChannel.bind('pusher:member_added', function (data) {
          const users = Object.entries(presenceChannel.members.members).filter((user) => user[1].id !== currentUserID)
          dispatch(onlineUserSlice.actions.setOnlineUsers(users))
        });
        presenceChannel.bind('pusher:member_removed', function (data) {
          const users = Object.entries(presenceChannel.members.members).filter((user) => user[1].id !== currentUserID)
          dispatch(onlineUserSlice.actions.setOnlineUsers(users))
        });
      }
    }
  }, [pusher, userDetails])
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Flip}
        theme="light"
      />
      <ForwardRequestNotification />
      <NewUserNotification />
      <NewRequestNotification />
      <UpdateRequestNotification />
      <PersonnelAssignmentNotification />
    </>
  )
}

export default Notifications