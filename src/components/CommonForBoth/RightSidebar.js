import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import user1 from "../../assets/images/users/avatar-1.jpg";
//SimpleBar
import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

import "../../components/CommonForBoth/rightbar.scss";
import {
  showRightSidebarAction,
} from "../../store/actions";
import { userModalSlice } from "features/modal/userModalSlice";
const RightSidebar = props => {
  const dispatch = useDispatch()
  const onlineUsers = useSelector((state) => state.onlineUsers.users)
  const getSpecificUserDetails = (e, id) => {
    e.preventDefault()
    props.showRightSidebarAction(false)
    dispatch(userModalSlice.actions.openModal())
    axios.post('api/admin/get-specific-user-details', {
      'id': id,
    }).then(res => {
      dispatch(userModalSlice.actions.setModalData(res.data))

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
  }
  return (
    <React.Fragment>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault()
                  props.showRightSidebarAction(false)
                }}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Online Users</h5>
            </div>
            <hr className="my-0" />


            {
              onlineUsers.length !== 0 ? (
                <div className="p-2">
                  <Table hover responsive>
                    <thead>
                    </thead>
                    <tbody>
                      {
                        onlineUsers.map(function (member) {
                          return (
                            <tr key={member[1].id + member[1].username}
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => { getSpecificUserDetails(e, member[1].id) }}
                            >
                              <td>
                                <img
                                  className="rounded-circle header-profile-user"
                                  src={user1}
                                  alt="Header Avatar"
                                />
                              </td>
                              <td>
                                <b>{member[1].name}</b><br />
                                <i>@{member[1].userRole}</i>
                              </td>
                            </tr>
                          )
                        })
                      }

                      {/* <tr>
                        <td style={{ height: '20%' }}>
                          <img
                            className="rounded-circle header-profile-user"
                            src={user1}
                            alt="Header Avatar"
                          />
                        </td>
                        <td style={{ height: '20%' }}>
                          <b>Prince Arnel Q. Conde</b><br />
                          <i>@PRINCEARNELCONDE</i>
                        </td>
                      </tr> */}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="p-4">
                  <h6 style={{ textAlign: 'center' }}>
                    No online user
                  </h6>
                </div>
              )
            }



          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </React.Fragment>
  );
};
RightSidebar.propTypes = {
  showRightSidebarAction: PropTypes.func,
};
const mapStateToProps = state => {
  return { ...state.Layout };
};

export default connect(mapStateToProps, {
  showRightSidebarAction,
})(RightSidebar);
