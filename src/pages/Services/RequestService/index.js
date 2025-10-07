import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Spinner,
  Alert,
  Progress,
} from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import Select2InputField from "components/Forms/select2InputField";
import BasicInputField from "components/Forms/BasicInputField";
import FileUpload from "components/Forms/fileUpload";
import { useSelector } from "react-redux";
const RequestService = (props) => {
  const requestTypesList = useSelector(
    (state) => state.requestType.requestTypes
  );
  const [requestTypesOption, setRequestTypesOption] = useState();
  const [requestOptions, setRequestOptions] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showError, setShowError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  useEffect(() => {
    const options = requestTypesList.map((item) => ({
      label: item.service_request_type_description,
      value: item.service_request_types_id,
    }));
    setRequestTypesOption(options);
  }, [requestTypesList]);

  const getFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (typeof object[key] !== "object") formData.append(key, object[key]);
      else {
        if (key !== "uploadedScreenshot") {
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
      requestType: "",
      requestedService: "",
      requestDescription: "",
    },
    validationSchema: Yup.object({
      requestType: Yup.object().shape({
        label: Yup.string().required("Please Enter Request Type"),
      }),
      requestedService: Yup.object().shape({
        label: Yup.string().required("Please Enter Request"),
      }),
      requestDescription: Yup.string().required(
        "Please enter description of your request"
      ),
    }),

    onSubmit: (values, { resetForm }) => {
      values["uploadedScreenshot"] = selectedFiles;
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
      Swal.fire({
        title: "Click Yes to Submit Request",
        icon: "warning",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(function (result) {
        if (result.value) {
          setShowProgressBar(true);
          var bodyFormData = getFormData(values);
          axios
            .post("api/service/submit-request-service", bodyFormData, options, {
              credentials: "include",
            })
            .then(
              (res) => {
                resetForm();
                setselectedFiles([]);
                setUploadProgress(100);
                setShowProgressBar(false);
                setShowError(null);
                setShowSuccess("Successfully Submitted Request");
                setUploadProgress(0);

                // Swal.fire({
                //     icon: 'success',
                //     title: 'Request successfully submitted',
                //     showConfirmButton: false,
                //     timer: 1500
                // }).then(function () {
                //     setUploadProgress(0)
                // });
              },
              (error) => {
                setShowError(
                  "Something went wrong, please refresh the page and try again. If the issue persist please contact CICTO, Thank you."
                );
                setShowProgressBar(false);
                setShowSuccess(null);
                setUploadProgress(0);
              }
            );
        } else {
          console.log("cancel");
        }
      });
    },
  });

  useEffect(() => {
    if (validation.values.requestType) {
      const selectedType = requestTypesList.filter((val) =>
        val.service_request_type_description.includes(
          validation.values.requestType.label
        )
      );

      if (selectedType.length !== 0) {
        const options = selectedType[0].service_request.map((item) => ({
          label: item.service_request_description,
          value: item.service_request_id,
        }));
        setRequestOptions(options);
      }
    } else {
      setRequestOptions([]);
    }
  }, [validation.values.requestType]);

  //**DROPZONE */
  const [selectedFiles, setselectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className=" d-flex flex-column">
          <Breadcrumbs title="Services" breadcrumbItem="Request Service" />

          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">Services</h4>
                  <p className="card-title-desc">
                    Please select an ICT service that corresponds to the issue
                    you are currently facing, an IT Personnel will be with you
                    shortly.
                  </p>
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {requestTypesOption && (
                      <>
                        <Row>
                          <Select2InputField
                            col={"12"}
                            label={"Request Type"}
                            id={"requestType"}
                            placeholder={"Select Request Type"}
                            validation={validation}
                            options={requestTypesOption}
                            onChangeFunctions={(requestTypesOption) => {
                              validation.setFieldValue(
                                "requestType",
                                requestTypesOption
                              );
                              validation.setFieldValue("requestedService", "");
                            }}
                          />
                        </Row>

                        <Row>
                          <Select2InputField
                            col={"12"}
                            label={"Request"}
                            id={"requestedService"}
                            placeholder={"Select Request"}
                            validation={validation}
                            options={requestOptions}
                            onChangeFunctions={(requestOptions) => {
                              validation.setFieldValue(
                                "requestedService",
                                requestOptions
                              );
                            }}
                          />
                        </Row>
                        <Row>
                          <BasicInputField
                            col={"12"}
                            label={"Description"}
                            id={"requestDescription"}
                            placeholder={"Enter description of your request"}
                            validation={validation}
                            type={"textarea"}
                            rows={"3"}
                          />
                        </Row>
                        <Row>
                          <FileUpload
                            selectedFiles={selectedFiles}
                            uploadError={uploadError}
                            setselectedFiles={setselectedFiles}
                            setUploadError={setUploadError}
                            label={
                              "Upload Screenshot of Issue/Error if available"
                            }
                          />
                        </Row>
                      </>
                    )}
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
                        <Col md="11">
                          <Progress
                            animated
                            value={uploadProgress}
                            style={{
                              height: "35px",
                            }}
                          >
                            {uploadProgress}%
                          </Progress>
                        </Col>
                      </Row>
                    ) : (
                      <>
                        {showError && (
                          <Alert
                            color="danger"
                            className="alert fade show"
                            role="alert"
                          >
                            <i className="mdi mdi-close-box-multiple-outline me-2"></i>
                            {showError}
                          </Alert>
                        )}
                        {showSuccess && (
                          <Alert
                            color="success"
                            className="alert fade show"
                            role="alert"
                          >
                            <i className="mdi mdi-check-box-multiple-outline me-2"></i>
                            {showSuccess}
                          </Alert>
                        )}

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

export default RequestService;
