import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Col, Button, Input, InputGroup, Label } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import BasicInputField from "components/Forms/BasicInputField";
import ExportButton from "../../pages/Summary/common/ExportButton";
import { dateFilterSlice } from "features/filters/dateFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const DashboardFilters = ({
  forAction,
  withStatus,
  statuses,
  withExport = false,
  tableParams,
  action,
}) => {
  const dispatch = useDispatch();
  const [parameters, setParams] = useState("");
  const [status, setStatus] = useState({ label: "", value: "" });
  const [permitTypeOptions, setPermitTypeOptions] = useState([]);

  useEffect(() => {
    dispatch(dateFilterSlice.actions.clearState());
  }, []);
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

  const validation = useFormik({
    enableReinitialize: false,
    initialValues: {
      keyword: "",
      date_from: "",
      date_to: "",
      type: "",
    },
    validationSchema: Yup.object({
      keyword: Yup.string().notRequired(),
      date_from: Yup.string().notRequired(),
      date_to: Yup.string().notRequired(),
    }),

    onSubmit: (values) => {
      const params = {
        ...tableParams,
        ...values,
      };

      setParams(params);
      dispatch(action(params));
      dispatch(dateFilterSlice.actions.setParams(params));
    },
  });
  const clearFilter = () => {
    validation.resetForm();
    setParams("");
    dispatch(action(tableParams));
    dispatch(dateFilterSlice.actions.clearState());
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
      {withStatus ? (
        <>
          {/* {console.log(status)} */}
          <Col style={{ width: "300px", paddingRight: "10px" }}>
            <div className="mb-9">
              <Label>Status</Label>
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
                  setStatus(statuses);
                  console.log(statuses);

                  validation.setFieldValue("status", statuses);
                }}
                onBlur={() => {
                  validation.handleBlur({ target: { name: "status" } });
                  validation.onSubmit;
                }}
                options={statuses}
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
        </>
      ) : null}

      <BasicInputField
        col={"6"}
        type={"text"}
        label={"Keyword"}
        touched={validation.touched.keyword}
        errors={validation.errors.keyword}
        name={"keyword"}
        validation={validation}
        placeholder={"Enter keyword"}
        value={validation.values.keyword}
      />
      <Col style={{ width: "250px" }}>
        <InputGroup className="d-flex flex-column">
          <Label>Permit Type</Label>
          <Select
            options={permitTypeOptions}
            onChange={(selected) => {
              validation.setFieldValue("type", selected.value);
            }}
            value={
              validation.values.type
                ? permitTypeOptions.find(
                    (option) => option.value === validation.values.type,
                  )
                : null
            }
          />
        </InputGroup>
      </Col>
      <div className="d-flex align-items-center" style={{ marginTop: "27px" }}>
        <Button type="submit">
          <i className="fas fa-search"></i>
        </Button>
      </div>
      {/* <BasicInputField
        col={"6"}
        type={"date"}
        label={"Date From:"}
        touched={validation.touched.date_from}
        errors={validation.errors.date_from}
        name={"date_from"}
        validation={validation}
        placeholder={""}
        value={validation.values.date_from}
      /> */}

      {/* <Col xs={12} style={{ width: "208px", paddingRight: "10px" }}>
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
      </Col> */}

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
      {withExport ? (
        <Col>
          <div style={{ paddingTop: "33px" }}></div>
          <ExportButton params={parameters} />
        </Col>
      ) : null}
    </Form>
  );
};

export default DashboardFilters;
