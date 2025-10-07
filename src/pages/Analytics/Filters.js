import React from "react";
import Select, { StylesConfig } from "react-select";
import { Form, Col, Button, Input, InputGroup, Label } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import BasicInputField from "components/Forms/BasicInputField";
import { dateFilterSlice } from "features/filters/dateFilterSlice";
import { useDispatch, useSelector } from "react-redux";
const Filters = ({ action }) => {
  const dispatch = useDispatch();
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      date_from: "",
      date_to: "",
    },
    validationSchema: Yup.object({
      date_from: Yup.string().notRequired(),
      date_to: Yup.string().notRequired(),
    }),

    onSubmit: (values) => {
      const params = values;
      dispatch(action(values));
    },
  });
  const clearFilter = () => {
    validation.resetForm();
    dispatch(action());
  };
  return (
    <Form
      className="row row-cols-lg-auto g-3"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <BasicInputField
        col={"6"}
        type={"date"}
        label={"Date From:"}
        touched={validation.touched.date_from}
        errors={validation.errors.date_from}
        name={"date_from"}
        validation={validation}
        placeholder={""}
        value={validation.values.date_from}
      />

      <Col xs={12} style={{ width: "208px", paddingRight: "10px" }}>
        <label
          // className="visually-hidden"
          htmlFor="inlineFormInputGroupUsername"
        >
          Date To:
        </label>
        <InputGroup>
          <Input
            id="date_to"
            name="date_to"
            className="form-control"
            placeholder="Enter Date To"
            type="date"
            onChange={validation.handleChange}
            value={validation.values.date_to || ""}
          />
          <Button type="submit">
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup>
      </Col>
      <Col>
        <label
          // className="visually-hidden"
          style={{ color: "#f8f8fb" }}
        >
          *
        </label>
        <br />
        <Button
          outline
          onClick={() => {
            clearFilter();
          }}
        >
          Clear Filter
        </Button>
      </Col>
    </Form>
  );
};

export default Filters;
