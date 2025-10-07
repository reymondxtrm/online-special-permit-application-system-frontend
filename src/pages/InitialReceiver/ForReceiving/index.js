/* eslint-disable padded-blocks */
import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  FormFeedback,
  Spinner,
  Alert,
  Progress,
  InputGroup,
  InputGroupText,
  Button,
} from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import AsyncSelect from "react-select/async";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px 1px 1px 1px solid #f46a6a",
    boxShadow: "1px 1px 1px 1px #f46a6a",
  }),
};

const Receive = (props) => {
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [genderTypeOptions, setGenderTypeOptions] = useState();
  const [typeOptions, setTypeOptions] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [isManual, setIsManual] = useState(false);
  const debounce = useRef();

  useEffect(() => {
    axios.get("api/gender-types").then(
      (res) => {
        const options = res.data.map((options) => ({
          value: options.id,
          label: options.gender_type,
        }));
        setGenderTypeOptions(options);
      },
      (error) => {
        console.log(error.response);
      }
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
      (error) => {
        console.log(error.response);
      }
    );
  }, []);
  const triggerInputMode = () => {
    setIsManual((prevState) => !prevState);
  };
  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (typeof object[key] !== "object") formData.append(key, object[key]);
      else {
        if (key !== "sample_card") {
          formData.append(key, JSON.stringify(object[key]));
        } else {
          object[key].forEach((element, index) => {
            formData.append(key + "[]", element);
          });
          // formData.append(key, (object[key][0]))
        }
      }
    });
    return formData;
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      permit_type_id: "",
      gender_type_id: "",
      business_code: "",
      name: "",
      owner: "",
      // business_permit: "",
      // plate_no: "",
      date_received: moment(new Date()).format("yyyy-MM-DD"),
      locationData: "test",
    },
    validationSchema: Yup.object({
      // business_code: Yup.string().notRequired(),
      permit_type_id: Yup.object().shape({
        label: Yup.string().required("Please Select a Permit Type"),
      }),
      gender_type_id: Yup.object().shape({
        label: Yup.string().required("Please Select a Gender - Type"),
      }),
      name: Yup.string().required("Please Enter a Name"),
      owner: Yup.string().required("Please Enter an Owner"),

      business_code: Yup.string().when("permit_type_id.label", {
        is: "RENEW",
        then: Yup.string().required("Please Enter Business Code"),
        otherwise: Yup.string().notRequired(),
      }),
    }),

    onSubmit: (values, { resetForm }) => {
      values["permit_type_id"] = values.permit_type_id.value;
      values["gender_type_id"] = values.gender_type_id.value;
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          let percent = Math.floor((loaded * 100) / total);

          if (percent < 100) {
            setUploadProgress(percent);
          }
          // (<ProgressBarComponent/>)
        },
      };

      setShowProgressBar(true);
      var bodyFormData = getFormData(values);
      axios
        .post("api/initial-receiver/receive", bodyFormData, options, {
          credentials: "include",
        })
        .then(
          (res) => {
            setShowProgressBar(false);
            resetForm();
            setUploadProgress(0);
            Swal.fire({
              title: "Successfully received!",
              icon: "success",
              draggable: true,
            });
          },
          (error) => {
            setShowProgressBar(false);

            setUploadProgress(0);
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
            });
          }
        );
    },
  });

  const loadOptions = (inputValue, callback) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    debounce.current = setTimeout(() => {
      return axios
        .get(`api/initial-receiver/existing-permit`, {
          params: {
            business_code: inputValue,
          },
        })
        .then((response) => {
          const options = response.data.map((item) => ({
            label: item.name,
            value: item,
          }));
          callback(options);
        })
        .catch((error) => {
          console.log(error.response);
          callback([]);
        });
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className=" d-flex flex-column">
          <Breadcrumbs title="Initial Receiving" breadcrumbItem="Receive" />

          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {
                      <>
                        <Row>
                          <Col md="4">
                            <div className="mb-3">
                              <Label>
                                Permit Type:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                              <Select
                                styles={
                                  validation.touched.permit_type_id &&
                                  validation.errors.permit_type_id
                                    ? customStyles
                                    : ""
                                }
                                isClearable="true"
                                name="permit_type_id"
                                placeholder="Select Permit Type"
                                onChange={(typeOptions) =>
                                  validation.setValues({
                                    business_code: "",
                                    name: "",
                                    owner: "",
                                    permit_type_id: typeOptions,
                                  })
                                }
                                onBlur={() => {
                                  validation.handleBlur({
                                    target: { name: "permit_type_id" },
                                  });
                                }}
                                options={typeOptions}
                                value={validation.values.permit_type_id || null}
                                aria-invalid={
                                  validation.touched.permit_type_id &&
                                  validation.errors.permit_type_id
                                    ? true
                                    : false
                                }
                                classNamePrefix="select2-selection"
                              />
                            </div>
                          </Col>

                          <Col md="4">
                            <div className="mb-3">
                              <Label>
                                Gender - Type:
                                <span style={{ color: "red" }}>&nbsp;*</span>
                              </Label>
                              <Select
                                styles={
                                  validation.touched.gender_type_id &&
                                  validation.errors.gender_type_id
                                    ? customStyles
                                    : ""
                                }
                                isClearable="true"
                                name="gender_type_id"
                                placeholder="Select Gender - Type"
                                onChange={(genderTypeOptions) =>
                                  validation.setFieldValue(
                                    "gender_type_id",
                                    genderTypeOptions
                                  )
                                }
                                onBlur={() => {
                                  validation.handleBlur({
                                    target: { name: "gender_type_id" },
                                  });
                                }}
                                options={genderTypeOptions}
                                value={validation.values.gender_type_id || null}
                                aria-invalid={
                                  validation.touched.gender_type_id &&
                                  validation.errors.gender_type_id
                                    ? true
                                    : false
                                }
                                classNamePrefix="select2-selection"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {validation.values.permit_type_id ? (
                            validation.values.permit_type_id.label ===
                            "RENEW" ? (
                              !isManual ? (
                                <>
                                  <Col md="8">
                                    <div className="mb-3">
                                      <Label className="form-label">
                                        Business Code:
                                        <span style={{ color: "red" }}>
                                          &nbsp;*
                                        </span>
                                      </Label>

                                      <Row>
                                        <Col lg={9}>
                                          <AsyncSelect
                                            cacheOptions
                                            loadOptions={loadOptions}
                                            defaultOptions
                                            onChange={(option) => {
                                              setSelectedOption(option);
                                              validation.setValues({
                                                ...validation.values,
                                                business_code:
                                                  option.value.business_code,
                                                name: option.value
                                                  .business_name,
                                                owner: option.value.owner,
                                              });
                                            }}
                                            value={selectedOption}
                                            placeholder="Search for an option..."
                                          />

                                          {validation.touched.business_code &&
                                          validation.errors.business_code ? (
                                            <FormFeedback
                                              type="invalid"
                                              style={{ display: "block" }}
                                            >
                                              {validation.errors.business_code}
                                            </FormFeedback>
                                          ) : null}
                                        </Col>
                                        <Col lg={3} className="text-end">
                                          <Button
                                            color="success"
                                            onClick={triggerInputMode}
                                          >
                                            Manually Input
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Col>
                                </>
                              ) : (
                                <div>
                                  <Col md="8">
                                    <Label className="form-label">
                                      Business Code:
                                      <span style={{ color: "red" }}>
                                        &nbsp;*
                                      </span>
                                    </Label>
                                    <Row>
                                      <Col lg={9}>
                                        <Input
                                          name="business_code"
                                          type="text"
                                          placeholder="Enter Business Code"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            validation.values.business_code.toUpperCase() ||
                                            ""
                                          }
                                          invalid={
                                            validation.touched.business_code &&
                                            validation.errors.business_code
                                              ? true
                                              : false
                                          }
                                        />
                                        {validation.touched.business_code &&
                                        validation.errors.business_code ? (
                                          <FormFeedback type="invalid">
                                            {validation.errors.business_code}
                                          </FormFeedback>
                                        ) : null}
                                      </Col>
                                      <Col lg={3} className="text-end">
                                        <Button
                                          color="success"
                                          onClick={triggerInputMode}
                                        >
                                          Advance Input
                                        </Button>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <div className="mb-3">
                                          <Label className="form-label">
                                            Business Name:
                                            <span style={{ color: "red" }}>
                                              &nbsp;*
                                            </span>
                                          </Label>
                                          <Input
                                            name="name"
                                            type="text"
                                            placeholder="Enter Business Name"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={
                                              validation.values.name.toUpperCase() ||
                                              ""
                                            }
                                            invalid={
                                              validation.touched.name &&
                                              validation.errors.name
                                                ? true
                                                : false
                                            }
                                          />
                                          {validation.touched.name &&
                                          validation.errors.name ? (
                                            <FormFeedback type="invalid">
                                              {validation.errors.name}
                                            </FormFeedback>
                                          ) : null}
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className="mb-3">
                                          <Label className="form-label">
                                            Business Owner:
                                            <span style={{ color: "red" }}>
                                              &nbsp;*
                                            </span>
                                          </Label>
                                          <Input
                                            name="owner"
                                            type="text"
                                            placeholder="Enter Business Owner"
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            value={
                                              validation.values.owner.toUpperCase() ||
                                              ""
                                            }
                                            invalid={
                                              validation.touched.owner &&
                                              validation.errors.owner
                                                ? true
                                                : false
                                            }
                                          />
                                          {validation.touched.owner &&
                                          validation.errors.owner ? (
                                            <FormFeedback type="invalid">
                                              {validation.errors.owner}
                                            </FormFeedback>
                                          ) : null}
                                        </div>
                                      </Col>
                                    </Row>
                                  </Col>
                                </div>
                              )
                            ) : null
                          ) : null}
                        </Row>
                        <Row>
                          {validation.values.permit_type_id ? (
                            validation.values.permit_type_id.label === "NEW" ? (
                              <>
                                <Col md="4">
                                  <div className="mb-3">
                                    <Label className="form-label">
                                      Business Name:
                                      <span style={{ color: "red" }}>
                                        &nbsp;*
                                      </span>
                                    </Label>
                                    <Input
                                      name="name"
                                      type="text"
                                      placeholder="Enter Business Name"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.name.toUpperCase() ||
                                        ""
                                      }
                                      invalid={
                                        validation.touched.name &&
                                        validation.errors.name
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.name &&
                                    validation.errors.name ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.name}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md="4">
                                  <div className="mb-3">
                                    <Label className="form-label">
                                      Business Owner:
                                      <span style={{ color: "red" }}>
                                        &nbsp;*
                                      </span>
                                    </Label>
                                    <Input
                                      name="owner"
                                      type="text"
                                      placeholder="Enter Business Owner"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={
                                        validation.values.owner.toUpperCase() ||
                                        ""
                                      }
                                      invalid={
                                        validation.touched.owner &&
                                        validation.errors.owner
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.owner &&
                                    validation.errors.owner ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.owner}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                              </>
                            ) : null
                          ) : null}
                        </Row>
                      </>
                    }

                    {showProgressBar ? (
                      <Row>
                        <Col md="1">
                          <button
                            className="btn btn-primary btn-block "
                            type="button"
                            disabled
                          >
                            <Spinner size="sm">Loading...</Spinner>
                          </button>
                        </Col>
                      </Row>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Submit
                        </button>
                      </>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Receive;
