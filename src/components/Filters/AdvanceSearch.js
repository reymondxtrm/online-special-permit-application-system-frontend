import BasicInputField from "components/Forms/BasicInputField";
import { advanceSearchSlice } from "features/AdvanceSearch";
import { Form, useFormik } from "formik";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { dateFilterSlice } from "features/filters/dateFilterSlice";
import Select from "react-select";

export default function AdvanceSearch({ action, forAction }) {
  const dispatch = useDispatch();
  const [genderTypeOptions, setGenderTypeOptions] = useState();
  const [typeOptions, setTypeOptions] = useState();
  const [statusOptions, setStatusOptions] = useState();
  const checkStatus = (status) => {
    if (status === "initial_received") {
      return "Initial Received";
    }
    if (status === "assessment_received") {
      return "Assessment Received";
    }
    if (status === "assessment_released") {
      return "Assessment Released";
    }
    if (status === "complete_received") {
      return "Complete Received";
    }
    if (status === "final_released") {
      return "Final Released";
    }
  };

  useEffect(() => {
    axios.get("api/gender-types").then(
      (res) => {
        const options = res.data.map((options) => ({
          value: options.id,
          label: options.gender_type,
        }));
        setGenderTypeOptions(options);
      },
      (error) => {}
    );
  }, []);
  useEffect(() => {
    axios.get("api/stages").then(
      (res) => {
        const options = res.data.map((options) => ({
          value: options.name,
          label: checkStatus(options.name),
        }));
        setStatusOptions(options);
      },
      (error) => {}
    );
  }, []);

  useEffect(() => {
    axios.get("api/permit-types").then(
      (res) => {
        const options = res.data.map((options) => ({
          value: options.id,
          label: options.name.toUpperCase(),
        }));
        setTypeOptions(options);
      },
      (error) => {}
    );
  }, []);

  const validation = useFormik({
    initialValues: {
      control_no: "",
      business_name: "",
      type: "",
      gender_type: "",
      business_code: "",
      business_permit: "",
      plate_no: "",
      owner: "",
      status: "",
      date: null,
      year: "",
    },
    onSubmit(values) {
      const params = {
        ...values,
        for_action: forAction,
      };
      dispatch(dateFilterSlice.actions.clearState());
      dispatch(dateFilterSlice.actions.setAdvanceParams(values));
      dispatch(action(params));
    },
    validationSchema: Yup.object({
      control_no: Yup.string(),
      business_name: Yup.string(),
      // date_from: Yup.string().notRequired(),
      // date_to: Yup.string().notRequired(),
      business_code: Yup.string(),
      business_permit: Yup.string(),
      plate_no: Yup.string(),
      year: Yup.string().notRequired(),
      owner: Yup.string(),
      status: Yup.string(),
      date: Yup.date()
        .transform((value, originalValue) => {
          // Accept null, empty string, or already a Date
          if (originalValue === null || originalValue === "") return null;
          // If value is already a Date, return as is
          if (value instanceof Date && !isNaN(value)) return value;
          // Try to parse string as date
          const parsed = new Date(originalValue);
          return isNaN(parsed) ? null : parsed;
        })
        .nullable()
        .notRequired(),
    }),
  });

  return (
    <Card style={{ border: "1px solid #3d5afe " }}>
      <CardBody>
        <Row>
          <Col>
            {" "}
            <BasicInputField
              label={"Control No:"}
              name={"control_no"}
              validation={validation}
              placeholder={"Enter control number"}
              touched={validation.touched.control_no}
              type={"text"}
              value={validation.values.control_no}
              errors={validation.errors.control_no}
              col={12}
            />
          </Col>
          <Col>
            {" "}
            <BasicInputField
              label={"Business Name:"}
              name={"business_name"}
              validation={validation}
              placeholder={"Enter business name"}
              touched={validation.touched.business_name}
              type={"text"}
              value={validation.values.business_name}
              errors={validation.errors.business_name}
              col={12}
            />
          </Col>
          <Col>
            {" "}
            <BasicInputField
              label={"Plate No:"}
              name={"plate_no"}
              validation={validation}
              placeholder={"Enter plate number"}
              touched={validation.touched.plate_no}
              type={"text"}
              value={validation.values.plate_no}
              errors={validation.errors.plate_no}
              col={12}
            />
          </Col>
          <Col>
            {" "}
            <Label>Permit - Type:</Label>
            <Select
              styles={
                validation.touched.type && validation.errors.type
                  ? customStyles
                  : ""
              }
              isClearable={true}
              name="type"
              placeholder="Select Gender - Type"
              onChange={(option) =>
                validation.setFieldValue("type", option ? option.value : "")
              }
              onBlur={() => {
                validation.handleBlur({
                  target: { name: "type" },
                });
              }}
              options={typeOptions}
              value={
                typeOptions?.find(
                  (opt) => opt.value === validation.values.type
                ) || null
              }
              aria-invalid={
                validation.touched.gender_type && validation.errors.type
                  ? true
                  : false
              }
              classNamePrefix="select2-selection"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <Label>Gender - Type:</Label>
            <Select
              styles={
                validation.touched.gender_type && validation.errors.gender_type
                  ? customStyles
                  : ""
              }
              isClearable={true}
              name="gender_type"
              placeholder="Select Gender - Type"
              onChange={(option) =>
                validation.setFieldValue(
                  "gender_type",
                  option ? option.value : ""
                )
              }
              onBlur={() => {
                validation.handleBlur({
                  target: { name: "gender_type" },
                });
              }}
              options={genderTypeOptions}
              value={
                genderTypeOptions?.find(
                  (opt) => opt.value === validation.values.gender_type
                ) || null
              }
              aria-invalid={
                validation.touched.gender_type && validation.errors.gender_type
                  ? true
                  : false
              }
              classNamePrefix="select2-selection"
            />
          </Col>
          <Col>
            {" "}
            <BasicInputField
              label={"Business Code:"}
              name={"business_code"}
              validation={validation}
              placeholder={"Enter business code"}
              touched={validation.touched.business_code}
              type={"text"}
              value={validation.values.business_code}
              errors={validation.errors.business_code}
              col={12}
            />
          </Col>
          <Col>
            {" "}
            <BasicInputField
              label={"Owner:"}
              name={"owner"}
              validation={validation}
              placeholder={"Enter business owner"}
              touched={validation.touched.owner}
              type={"text"}
              value={validation.values.owner}
              errors={validation.errors.owner}
              s
              col={12}
            />
          </Col>
          <Col>
            {" "}
            <div className="mb-9">
              <Label>Permit Status</Label>
              <Select
                styles={
                  validation.touched.roles && validation.errors.roles
                    ? customStyles
                    : ""
                }
                isClearable="true"
                name="status"
                placeholder="Select Status"
                onChange={(statuses) => {
                  setStatusOptions(statuses);
                  validation.setFieldValue("status", statuses);
                }}
                onBlur={() => {
                  validation.handleBlur({ target: { name: "status" } });
                  validation.onSubmit;
                }}
                options={statusOptions}
                value={validation.values.status}
                aria-invalid={
                  validation.touched.status && validation.errors.status
                    ? true
                    : false
                }
                classNamePrefix="select2-selection"
              />
            </div>
          </Col>
        </Row>
        <Row lg={7}>
          <Col>
            <BasicInputField
              label={"Business Permit No:"}
              name={"business_permit"}
              validation={validation}
              placeholder={"Enter business permit number"}
              touched={validation.touched.business_permit}
              type={"text"}
              value={validation.values.business_permit}
              errors={validation.errors.business_permit}
              col={12}
            />
          </Col>
          {/* <Col>
            <BasicInputField
              col={"12"}
              type={"date"}
              label={"Date From:"}
              touched={validation.touched.date_from}
              errors={validation.errors.date_from}
              name={"date_from"}
              validation={validation}
              placeholder={""}
              value={validation.values.date_from}
            />
          </Col> */}
          {/* <Col>
            <BasicInputField
              col={"12"}
              type={"date"}
              label={"Date to:"}
              touched={validation.touched.date_to}
              errors={validation.errors.date_to}
              name={"date_to"}
              validation={validation}
              placeholder={""}
              value={validation.values.date_to}
            />
          </Col> */}
          <Col>
            <BasicInputField
              col={"12"}
              type={"text"}
              label={"Year:"}
              touched={validation.touched.year}
              errors={validation.errors.year}
              name={"year"}
              validation={validation}
              placeholder={""}
              value={validation.values.year}
              disable={validation.values.date ? true : false}
            />
          </Col>
          <Col>
            <BasicInputField
              label={"Date:"}
              name={"date"}
              validation={validation}
              placeholder={"Enter permit status"}
              touched={validation.touched.date}
              type={"date"}
              value={validation.values.date}
              errors={validation.errors.date}
              col={12}
              disable={validation.values.year ? true : false}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={(e) => {
                e.preventDefault();
                validation.handleSubmit();
              }}
              type="submit"
            >
              Search
            </Button>
            <Button
              outline
              onClick={() => {
                validation.resetForm();
                dispatch(action());
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
