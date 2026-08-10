import BasicInputField from "components/Forms/BasicInputField";
import useSubmit from "hooks/Common/useSubmit";
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

const UpdateIndividualOccupationalDetails = ({
  openModal,
  toggleModal,
  userId,
  toggleRefresh,
}) => {
  const handleSubmit = useSubmit();
  const [userOccupationalDetails, setUserOccupationalDetails] = useState({});
  //   const user = userDetails?.corporation_member || null;
  //   const address =
  //     userDetails?.corporation_member?.user_addresses_morph?.[0] || null;
  useEffect(() => {
    axios
      .get("api/admin/get/user-occupation-details", {
        params: { user_id: userId },
      })
      .then(
        (res) => {
          setUserOccupationalDetails(res.data);
          console.log(res.data);
        },
        (error) => {
          console.log(error);
        },
      );
  }, []);

  const validationSchema = Yup.object({
    address_line: Yup.string().required("Address Line is required"),
    barangay: Yup.string().required("Barangay is required"),
    city: Yup.string().required("City is required"),
    province: Yup.string().notRequired(),
    subdivision: Yup.string().notRequired(),
    company_name: Yup.string().required("First Name is required"),
    position: Yup.string().notRequired(),
    date_hired: Yup.string().required("Last Name is required"),
  });
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      address_line: userOccupationalDetails.address_line || "",
      barangay: userOccupationalDetails.barangay || "",
      province: userOccupationalDetails.province || "",
      subdivision: userOccupationalDetails.subdivision || "",
      city: userOccupationalDetails.city || "",
      user_id: userId,
      company_name: userOccupationalDetails.company_name || "",
      position: userOccupationalDetails.position || "",
      date_hired: userOccupationalDetails.date_hired || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      handleSubmit(
        {
          url: "api/admin/update/user-occupation-details",
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
    <Modal isOpen={openModal} toggle={toggleModal}>
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
          Update User Occupational Details
        </p>
      </ModalHeader>
      <ModalBody>
        <BasicInputField
          type={"text"}
          name={"company_name"}
          value={validation.values.company_name}
          validation={validation}
          touched={validation.touched.company_name}
          errors={validation.errors.company_name}
          label={"Company Name:"}
        />
        <BasicInputField
          type={"text"}
          name={"position"}
          value={validation.values.position}
          validation={validation}
          touched={validation.touched.position}
          errors={validation.errors.position}
          label={"Position:"}
        />
        <BasicInputField
          type={"date"}
          name={"date_hired"}
          value={validation.values.date_hired}
          validation={validation}
          touched={validation.touched.date_hired}
          errors={validation.errors.date_hired}
          label={"Date Hired:"}
        />
        <hr></hr>
        <div className="text-center">
          <span>Company Address</span>
        </div>
        <BasicInputField
          type={"text"}
          name={"address_line"}
          value={validation.values.address_line}
          validation={validation}
          touched={validation.touched.address_line}
          errors={validation.errors.address_line}
          label={"Purok/Street/Bldg:"}
        />
        <BasicInputField
          type={"text"}
          name={"subdivision"}
          value={validation.values.subdivision}
          validation={validation}
          touched={validation.touched.subdivision}
          errors={validation.errors.subdivision}
          label={"Subdivision:"}
        />
        <BasicInputField
          type={"text"}
          name={"barangay"}
          value={validation.values.barangay}
          validation={validation}
          touched={validation.touched.barangay}
          errors={validation.errors.barangay}
          label={"Barangay:"}
        />
        <BasicInputField
          type={"text"}
          name={"city"}
          value={validation.values.city}
          validation={validation}
          touched={validation.touched.city}
          errors={validation.errors.city}
          label={"City:"}
        />
        <BasicInputField
          type={"text"}
          name={"province"}
          value={validation.values.province}
          validation={validation}
          touched={validation.touched.province}
          errors={validation.errors.province}
          label={"Province:"}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-1">
          <Button color="primary" onClick={validation.handleSubmit}>
            Update
          </Button>
          <Button outline onClick={toggleModal}>
            Cancel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateIndividualOccupationalDetails;
