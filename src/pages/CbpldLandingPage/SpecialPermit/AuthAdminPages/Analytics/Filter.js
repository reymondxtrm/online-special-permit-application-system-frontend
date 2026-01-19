import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Form, Col, Button, Input, InputGroup, Label } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import BasicInputField from "components/Forms/BasicInputField";
import { useDispatch } from "react-redux";
import axios from "axios";
const Filters = ({ action, updateFilter }) => {
  const dispatch = useDispatch();
  const [permitTypeOptions, setPermitTypeOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: "api/admin/get/permit-types",
          method: "GET",
        });
        if (response) {
          const options = response.data.map((options) => ({
            value: options.id,
            label: options.name,
          }));
          setPermitTypeOptions(options);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const date_from = startOfMonth.toISOString().split("T")[0];
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const date_to = endOfMonth.toISOString().split("T")[0];
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      date_from: date_from || "",
      date_to: date_to || "",
      type: 2,
    },
    validationSchema: Yup.object({
      date_from: Yup.string().notRequired(),
      date_to: Yup.string().notRequired(),
    }),

    onSubmit: (values) => {
      const params = values;
      dispatch(action(params));
      dispatch(updateFilter(params));
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
      <div className="d-flex gap-2">
        <BasicInputField
          type={"date"}
          label={"Date From:"}
          touched={validation.touched.date_from}
          errors={validation.errors.date_from}
          name={"date_from"}
          validation={validation}
          placeholder={""}
          value={validation.values.date_from}
        />
        <BasicInputField
          type={"date"}
          label={"Date To:"}
          touched={validation.touched.date_to}
          errors={validation.errors.date_to}
          name={"date_to"}
          validation={validation}
          placeholder={""}
          value={validation.values.date_to}
        />

        <InputGroup className="d-flex flex-column" style={{ width: "150px" }}>
          <Label>Type</Label>
          <Select
            options={permitTypeOptions}
            onChange={(e) => validation.setFieldValue("type", e.value)}
            value={permitTypeOptions.find(
              (item) => item.value === validation.values.type,
            )}
          />
        </InputGroup>
      </div>

      <Col>
        <label style={{ color: "#f8f8fb" }}>*</label>
        <br />
        <Button
          onClick={() => {
            validation.handleSubmit();
          }}
        >
          <i className="mdi mdi-magnify"></i>
        </Button>
      </Col>

      {/* <Col>
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
      </Col> */}
    </Form>
  );
};

export default Filters;
