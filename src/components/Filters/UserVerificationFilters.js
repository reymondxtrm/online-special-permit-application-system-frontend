import React from 'react'
import { Col, Button, Form, Input, InputGroup } from "reactstrap";
import { useFormik } from "formik";
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { getUserList } from 'features/user/userListSlice';
const UserVerificationFilters = ({
  props
}) => {
  const dispatch = useDispatch()
  const statusList = useSelector((state) => state.status.statusList)
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: '',
      fullName: ''
    },

    onSubmit: (values) => {
      let tempValue = { ...values }
      tempValue['status'] = values['status']?.value
      dispatch(getUserList({ 'history': props.history, 'filter': tempValue }))
    }
  });
  return (
    <Form className="row row-cols-lg-auto g-3"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}>
      <Col xs={12}>
        <label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Clear</label>
        <Button variant="light" type="button" onClick={() => { validation.resetForm(); validation.submitForm() }}>Clear Filters:</Button>
      </Col>

      <Col xs={12} style={{ width: 250, paddingRight: '10px' }}>
        <label className="visually-hidden" htmlFor="inlineFormSelectPref">Status</label>
        <Select
          isClearable="true"
          name="status"
          placeholder="Select Status"
          onChange={(statusList) => validation.setFieldValue("status", statusList)}
          options={statusList}
          value={validation.values.status || null}
          classNamePrefix="select2-selection"
        />
      </Col>
      <Col xs={12}>
        <label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Username</label>
        <InputGroup>
          <Input
            id="fullName"
            name="fullName"
            className="form-control"
            placeholder="Enter Name"
            type="text"
            onChange={validation.handleChange}
            value={validation.values.fullName || ""}
          />
          <Button type='submit'>
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup>
      </Col>
    </Form>
  )
}

export default UserVerificationFilters