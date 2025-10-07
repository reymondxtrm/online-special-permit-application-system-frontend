import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Form,
  Input,
  Label,
} from "reactstrap";
import Select from "react-select";
import { Formik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import axios from "axios";

function ReviewPurposeModal({
  openModal,
  toggleModal,
  toggleRefresh,
  purposeData,
  purposeOptions,
}) {
  const handleSubmit = useSubmit();
  const formikRef = useRef(null);
  const [changePurpose, setChangePurpose] = useState(false);

  useEffect(() => {
    if (openModal) {
      axios.get("api/admin/get/permit-types").then(
        (res) => {
          const options = res.data.map((option) => ({
            value: option.id,
            label: option.name,
          }));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [openModal]);

  return (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      backdrop="static"
      size="lg"
      className="modal-dialog-centered"
      unmountOnClose
    >
      <ModalHeader toggle={toggleModal}>
        <p
          style={{
            fontWeight: "bold",
            letterSpacing: ".2rem",
            fontSize: "18pt",
            margin: "0",
            padding: "0",
            color: "#368be0",
          }}
        >
          {"REVIEW PURPOSE"}
        </p>
      </ModalHeader>
      <ModalBody>
        <Formik
          innerRef={formikRef}
          initialValues={{ purpose: purposeData?.name || "" }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(props) => (
            <Form>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: "60%" }}>
                      {changePurpose ? (
                        <>
                          <Select
                            id="purpose_id"
                            isClearable={true}
                            placeholder="Select Purpose"
                            options={purposeOptions}
                            onChange={(option) =>
                              props.setFieldValue("purpose_id", option)
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            id="purpose"
                            name="purpose"
                            placeholder="Enter Purpose"
                            value={props.values.purpose}
                            onChange={props.handleChange}
                            style={{ width: "100%" }}
                          />
                        </>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        color="primary"
                        onClick={() => setChangePurpose(false)}
                        style={{ marginRight: "5px" }}
                      >
                        Add to List
                      </Button>
                      <Button
                        color="success"
                        onClick={() => setChangePurpose(true)}
                      >
                        Change Purpose
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Form>
          )}
        </Formik>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            const formik = formikRef.current.values;
            const endpoint = changePurpose
              ? "api/admin/change/purpose"
              : "api/admin/add/list-purpose";
            const payload = changePurpose
              ? {
                  purpose_id: formik.purpose_id?.value,
                  application_id: purposeData.application_id,
                }
              : { purpose_name: formik.purpose, purpose_id: purposeData.id };
            handleSubmit(
              {
                url: endpoint,
                message: {
                  title: "Are you sure you want to Proceed?",
                  failedTitle: "FAILED",
                  success: "Success!",
                  error: "Unknown error occurred",
                },
                params: payload,
              },
              [],
              [toggleModal, toggleRefresh]
            );
          }}
        >
          Save
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ReviewPurposeModal;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Table,
//   Badge,
//   Form,
//   Row,
//   Col,
//   Input,
//   Label,
//   FormGroup,
// } from "reactstrap";
// import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Select, { StylesConfig } from "react-select";
// import { FieldArray, Formik } from "formik";
// import useSubmit from "hooks/Common/useSubmit";
// import axios from "axios";

// function ReviewPurposeModal({
//   openModal,
//   toggleModal,
//   toggleRefresh,
//   purposeData,
//   purposeOptions,
// }) {
//   const handleSubmit = useSubmit();
//   const formikRef = useRef(null);
//   const [options, setoptions] = useState();
//   const [changePurpose, setchangePurpose] = useState(false);
//   const [addToList, setaddToList] = useState(true);
//   const toggleChangePurpose = () => {
//     setchangePurpose(true);
//     setaddToList(false);
//   };
//   const toggleAddToList = () => {
//     setchangePurpose(false);
//     setaddToList(true);
//   };
//   const getFormData = (object) => {
//     const formData = new FormData();
//     Object.keys(object).forEach((key) => {
//       if (object[key] instanceof File || object[key] instanceof Blob) {
//         formData.append(key, object[key]); // Directly append files
//       } else if (Array.isArray(object[key])) {
//         object[key].forEach((item) => formData.append(`${key}[]`, item));
//       } else if (typeof object[key] === "object" && object[key] !== null) {
//         formData.append(key, JSON.stringify(object[key]));
//       } else {
//         formData.append(key, object[key]);
//       }
//     });
//     return formData;
//   };
//   useEffect(() => {
//     if (openModal) {
//       axios
//         .get("api/admin/get/permit-types", {
//           //   params: { permit_type: "good_moral" },
//         })
//         .then(
//           (res) => {
//             const options = res.data.map((options) => ({
//               value: options.id,
//               label: options.name,
//             }));
//             setoptions(options);
//           },
//           (error) => {
//             console.log(error);
//           }
//         );
//     }
//   }, [openModal]);

//   return (
//     <React.Fragment>
//       <Modal
//         isOpen={openModal}
//         toggle={toggleModal}
//         fade={true}
//         backdrop="static"
//         size="m"
//         className="modal-dialog-centered"
//         style={{
//           //  maxHeight: "90vh",
//           overflowY: "auto",
//           // maxWidth: "1400px",
//         }}
//         unmountOnClose
//       >
//         <ModalHeader toggle={toggleModal}>
// <p
//   style={{
//     fontWeight: "bold",
//     letterSpacing: ".2rem",
//     fontSize: "18pt",
//     margin: "0",
//     padding: "0",
//     color: "#368be0",
//   }}
// >
//   {"REVIEW PURPOSE"}
// </p>
//         </ModalHeader>
//         <ModalBody>
//           <Formik
//             innerRef={formikRef}
//             initialValues={{
//               purpose: purposeData?.name || "",
//             }}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {(props) => (
//               <Form>
//                 <Col>
//                   <Row>
//                     <Col md={12}>
//                       <FormGroup>
//                         {addToList && (
//                           <>
//                             <Label for="purpose">Purpose</Label>
//                             <Input
//                               id="purpose"
//                               name={`purpose`}
//                               placeholder="Enter Purpose"
//                               value={props.values.purpose}
//                               onChange={props.handleChange}
//                             />
//                           </>
//                         )}
//                         {changePurpose && (
//                           <>
//                             <Label for="purpose">Select Purpose</Label>
//                             <Select
//                               id="purpose_id"
//                               isClearable={true}
//                               placeholder="Select Purpose"
//                               options={purposeOptions}
//                               onChange={(option) =>
//                                 props.setFieldValue("purpose_id", option)
//                               }
//                             />
//                           </>
//                         )}
//                       </FormGroup>
//                     </Col>
//                   </Row>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Button
//                       style={{
//                         backgroundColor: "#1a56db",
//                         fontWeight: "600",
//                         fontFamily:
//                           "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
//                         color: "white",
//                         width: "200px",
//                       }}
//                       onClick={toggleAddToList}
//                     >
//                       ADD TO LIST
//                     </Button>
//                     <Button
//                       style={{
//                         backgroundColor: "#1a56db",
//                         fontWeight: "600",
//                         fontFamily:
//                           "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
//                         color: "white",
//                         width: "200px",
//                       }}
//                       onClick={toggleChangePurpose}
//                     >
//                       CHANGE PURPOSE
//                     </Button>
//                   </div>
//                 </Col>
//               </Form>
//             )}
//           </Formik>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             style={{
//               backgroundColor: "#1a56db",
//               fontWeight: "600",
//               fontFamily:
//                 "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
//               color: "white",
//             }}
//             onClick={() => {
//               const formik = formikRef.current.values;

//               const endpoint = changePurpose
//                 ? "api/admin/change/purpose"
//                 : "api/admin/add/list-purpose";

//               const payload = changePurpose
//                 ? {
//                     purpose_id: formik.purpose_id?.value,
//                     application_id: purposeData.application_id,
//                   }
//                 : {
//                     purpose_name: formik.purpose,
//                     purpose_id: purposeData.id,
//                   };
//               console.log(payload);
//               handleSubmit(
//                 {
//                   url: endpoint,
//                   message: {
//                     title: "Are you sure you want to Proceed?",
//                     failedTitle: "FAILED",
//                     success: "Success!",
//                     error: "unknown error occured",
//                   },
//                   params: payload,
//                 },
//                 [], //for dispatch Array
//                 [toggleModal, toggleRefresh] //for Toggle array
//               );
//             }}
//           >
//             Save
//           </Button>
//           <Button color="secondary" onClick={toggleModal}>
//             Close
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </React.Fragment>
//   );
// }

// export default ReviewPurposeModal;
