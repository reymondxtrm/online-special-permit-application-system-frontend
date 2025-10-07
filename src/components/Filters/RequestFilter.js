import React from 'react'
import { Col, Button, Form, Input, InputGroup } from "reactstrap";
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import { requestedServiceSlice } from 'features/filters/requestedServiceSlice';
const RequestFilter = ({
  validation
}) => {
  const dispatch = useDispatch()
  const statusList = useSelector((state) => state.status.requestStatusList)
  const handleChangeStatus = (status) => {
    if (!status) {
      validation.setFieldValue('requestStatus', '')
    }
  }
  return (
    <Form className="row row-cols-lg-auto g-3"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}>
      <Col xs={12}>
        <label
          className="visually-hidden"
          htmlFor="inlineFormInputGroupUsername">
          Clear
        </label>

        <Button
          variant="light"
          type="button"
          onClick={() => {
            dispatch(requestedServiceSlice.actions.setParams({
              requestStatus: { 'label': 'OPEN', 'value': 4 },
              requestDetails: ''
            }))
            validation.setFieldValue('requestStatus', { 'label': 'OPEN', 'value': 4 })
            validation.setFieldValue('requestDetails', '')
            validation.submitForm()
          }}>
          Clear Filters:
        </Button>
      </Col>
      <Col xs={12} style={{ width: 250, paddingRight: '10px' }}>
        <label
          className="visually-hidden"
          htmlFor="inlineFormSelectPref">
          Request
        </label>

        <Select
          isClearable="true"
          clearValue=''
          name="status"
          placeholder="Select Request Status"
          onChange={(statusList) => { validation.setFieldValue("requestStatus", statusList); handleChangeStatus(statusList) }}
          options={statusList}
          value={validation.values.requestStatus || ''}
          classNamePrefix="select2-selection"
        />
      </Col>
      <Col xs={12} style={{ width: 450, paddingRight: '10px' }}>
        <label
          className="visually-hidden"
          htmlFor="inlineFormInputGroupUsername">
        </label>
        <InputGroup>
          <Input
            id="requestDetails"
            name="requestDetails"
            className="form-control"
            placeholder="Enter Ticket Number or Request Description"
            type="text"
            onChange={validation.handleChange}
            value={validation.values.requestDetails || ""}
          />
          <Button type='submit'>
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup>
      </Col>
    </Form>
  )
}

export default RequestFilter