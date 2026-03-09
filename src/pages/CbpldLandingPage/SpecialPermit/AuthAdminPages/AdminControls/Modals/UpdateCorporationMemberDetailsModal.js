import BasicInputField from "components/Forms/BasicInputField";
import { useFormik } from "formik";
import useSubmit from "hooks/Common/useSubmit";
import React from "react";
import * as Yup from "yup";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const UpdateCorporationMemberDetailsModal = ({
  corporationMemberId,
  openModal,
  toggleModal,
  userDetails,
  toggleRefresh,
}) => {
  const handleSubmit = useSubmit();
  const user = userDetails?.corporation_member || null;
  const address =
    userDetails?.corporation_member?.user_addresses_morph?.[0] || null;
  const occupation =
    userDetails?.corporation_member?.user_occupation_details_morph || null;

  const validationSchema = Yup.object({
    address_line: Yup.string().required("Address Line is required"),
    barangay: Yup.string().required("Barangay is required"),
    city: Yup.string().required("City is required"),
    province: Yup.string().notRequired(),
    subdivision: Yup.string().notRequired(),
    fname: Yup.string().required("First Name is required"),
    mname: Yup.string().notRequired(),
    suffix: Yup.string().notRequired(),
    lname: Yup.string().required("Last Name is required"),
    position: Yup.string().required("Position is required"),
  });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      address_line: address.address_line || "",
      barangay: address.barangay || "",
      city: address.city || "",
      province: address.province || "",
      subdivision: address.subdivision || "",
      corporation_member_id: corporationMemberId,
      fname: user.fname || "",
      suffix: user.suffix || "",
      mname: user.mname || "",
      lname: user.lname || "",
      position: occupation?.position || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      handleSubmit(
        {
          url: "api/admin/update/corporation-memmber-details",
          params: values,
          message: {
            title: "Are you sure you want to update this User? ",
            failedTitle: "FAILED",
            success: "Success!",
            error: "unknown error occured",
          },
        },
        [],
        [toggleModal, toggleRefresh],
      );
    },
  });
  return (
    <Modal isOpen={openModal} toggle={toggleModal} size="lg">
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
          Update Corporation Member Details
        </p>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={validation.handleSubmit}>
          <Row>
            <Col></Col>
            <Col></Col>
          </Row>

          <BasicInputField
            col={12}
            validation={validation}
            name={"fname"}
            type={"text"}
            touched={validation.touched.fname}
            errors={validation.errors.fname}
            value={validation.values.fname}
            label={"First Name:"}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"mname"}
            type={"text"}
            touched={validation.touched.mname}
            errors={validation.errors.mname}
            value={validation.values.mname}
            label={"Middle Name:"}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"lname"}
            type={"text"}
            touched={validation.touched.lname}
            errors={validation.errors.lname}
            value={validation.values.lname}
            label={"Last Name:"}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"suffix"}
            type={"text"}
            touched={validation.touched.suffix}
            errors={validation.errors.suffix}
            value={validation.values.suffix}
            label={"Suffix:"}
          />
          <hr></hr>
          <BasicInputField
            col={12}
            validation={validation}
            name={"address_line"}
            type={"text"}
            touched={validation.touched.address_line}
            errors={validation.errors.address_line}
            label={"Purok/Street/House No.:"}
            value={validation.values.address_line}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"subdivision"}
            type={"text"}
            touched={validation.touched.subdivision}
            errors={validation.errors.subdivision}
            label={"Subdivision:"}
            value={validation.values.subdivision}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"barangay"}
            type={"text"}
            touched={validation.touched.barangay}
            errors={validation.errors.barangay}
            label={"Barangay:"}
            value={validation.values.barangay}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"city"}
            type={"text"}
            touched={validation.touched.city}
            errors={validation.errors.city}
            value={validation.values.city}
            label={"City:"}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"province"}
            type={"text"}
            touched={validation.touched.province}
            errors={validation.errors.province}
            value={validation.values.province}
            label={"Province:"}
          />
          <BasicInputField
            col={12}
            validation={validation}
            name={"position"}
            type={"text"}
            touched={validation.touched.position}
            errors={validation.errors.position}
            value={validation.values.position}
            label={"Occupation:"}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
            color="primary"
          >
            Update
          </Button>
          <Button onClick={toggleModal} color="secondary" outline>
            Cancel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateCorporationMemberDetailsModal;
