import React, { useState, useEffect } from 'react'
import { Col, Button, Form, Input, InputGroup } from "reactstrap";
import { useFormik } from "formik";
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { getUserListControls } from 'features/user/userListSlice';
const UserControlsFilter = ({
  props
}) => {
  const dispatch = useDispatch()
  const statusList = useSelector((state) => state.status.statusList)
  const userRoleList = useSelector((state) => state.userList.userRoles)
  const divisionList = useSelector((state) => state.userList.divisions);
  const [divisionOptions, setDivisionOptions] = useState()
  useEffect(() => {
    if (divisionList.length) {
      const divOptions = divisionList.map((item) => (
        { label: item.division, value: item.divisions_id }
      ))
      setDivisionOptions(divOptions)
    }
  }, [divisionList])

  const [userRoleOptions, setUserRoleOptions] = useState()
  useEffect(() => {
    if (userRoleList.length) {
      const roleOptions = userRoleList.map((item) => (
        { label: item.role, value: item.user_roles_id }
      ))
      setUserRoleOptions(roleOptions)
    }
  }, [userRoleList])
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      division: '',
      userRole:'',
      fullName: null
    },

    onSubmit: (values) => {
      let tempValue = { ...values }
      tempValue['division'] = values['division']?.value
      tempValue['userRole'] = values['userRole']?.value
      dispatch(getUserListControls({ 'history': props.history, 'filter': tempValue }))
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

      <Col xs={12} style={{ width: 300, paddingRight: '10px' }}>
        <label className="visually-hidden" htmlFor="inlineFormSelectPref">Division</label>
        <Select
          isClearable="true"
          name="division"
          placeholder="Select Division"
          onChange={(divisionOptions) => validation.setFieldValue("division", divisionOptions)}
          options={divisionOptions}
          value={validation.values.division || null}
          classNamePrefix="select2-selection"
        />
      </Col>
      <Col xs={12} style={{ width: 250, paddingRight: '10px' }}>
        <label className="visually-hidden" htmlFor="inlineFormSelectPref">Division</label>
        <Select
          isClearable="true"
          name="userRole"
          placeholder="Select User Role"
          onChange={(userRoleOptions) => validation.setFieldValue("userRole", userRoleOptions)}
          options={userRoleOptions}
          value={validation.values.userRole || null}
          classNamePrefix="select2-selection"
        />
      </Col>
      <Col xs={12} style={{ width: 350, paddingRight: '10px' }}>
        <label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Name</label>
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

export default UserControlsFilter