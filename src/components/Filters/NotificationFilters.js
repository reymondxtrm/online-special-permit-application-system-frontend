import React from 'react'
import { Col, Button, Form, Input, InputGroup } from "reactstrap";
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import { notificationMarkAllAsRead } from 'features/notifications/userNotificationsSlice';
const NotificationFilters = ({
  validation, props
}) => {
  const dispatch = useDispatch()
  const statusList = useSelector((state) => state.userNotifications.status)
  const handleChangeStatus = (status) => {
    if (!status) {
      validation.setFieldValue('notificationStatus', '')
    }
  }
  return (
    <Form className="row row-cols-lg-auto g-3"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}>
      <Col xs={12} style={{ width: 250, paddingRight: '10px' }}>
        <label
          className="visually-hidden"
          htmlFor="inlineFormSelectPref">
          Request
        </label>

        <Select
          name="status"
          placeholder="Select Request Status"
          onChange={(statusList) => {
            validation.setFieldValue("notificationStatus", statusList);
            handleChangeStatus(statusList);
            validation.submitForm()
          }}
          options={statusList}
          value={validation.values.notificationStatus || ''}
          classNamePrefix="select2-selection"
        />
      </Col>
      {
        validation.values.notificationStatus.value === 11 && (
          <Col xs={12}>
            <label
              className="visually-hidden"
              htmlFor="inlineFormInputGroupUsername">
              Read
            </label>

            <Button
              variant="light"
              type="button"
              onClick={() => {
                dispatch(notificationMarkAllAsRead({ 'history': props.history }))
                validation.submitForm()
              }}>
              Mark all as read
            </Button>
          </Col>
        )
      }

    </Form>
  )
}

export default NotificationFilters