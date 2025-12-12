import BasicInputField from "components/Forms/BasicInputField";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Select from "react-select";
import {
  BLOOD_TYPE_OPTIONS,
  CITIZENSHIP_OPTIONS,
} from "../../../assets/data/data";
import ParadeModal from "./ParadeModal";
import axios from "axios";
export default function CedulaAddtionalDetailsModal({
  setAdditionalDetails,
  isOpen,
  toggle,
  values,
}) {
  const [details, setDetails] = useState({
    citizenship: "",
    civil_status: "",
    place_of_birth: "",
    blood_type: "",
    height: "",
    weight: "",
    tin: "",
    occupation: "",
    monthly_salary: "",
    date_hired: "",
  });
  const [civilStatusoptions, setCivilStatusOptions] = useState();
  useEffect(() => {
    if (isOpen) {
      const getCivilStatus = async () => {
        try {
          const response = await axios({
            url: "api/get-civil-status",
            method: "GET",
            params: { permit_type: "good_moral" },
          });
          if (response) {
            const options = response.data.map((item) => {
              return { value: item.id, label: item.name };
            });
            setCivilStatusOptions(options);
          }
        } catch (error) {
          console.log(error.response.data);
        }
      };
      getCivilStatus();
    }
  }, [isOpen]);

  const handleCancel = () => {
    // setDetails({
    //   citizenship: "",
    //   civil_status: "",
    //   place_of_birth: "",
    //   date_hired: "",
    //   blood_type: "",
    //   height: "",
    //   weight: "",
    //   tin: "",
    //   occupation: "",
    //   monthly_salary: "",
    // });
    toggle();
  };

  const handleSave = () => {
    setAdditionalDetails(details);
    handleCancel();
  };
  console.log("details", details, "values", values);
  useEffect(() => {
    if (isOpen) {
      setDetails({
        citizenship:
          // CITIZENSHIP_OPTIONS.find(
          //   (option) => option.label === values?.citizenship
          // ) || null,
          values?.citizenship,
        civil_status:
          // civilStatusoptions?.find(
          //   (option) => option.value === values?.civil_status
          // ) || null,
          values?.civil_status,
        blood_type:
          // BLOOD_TYPE_OPTIONS.find(
          //   (option) => option.value === values?.blood_type
          // ) || null,
          values?.blood_type,
        place_of_birth: values?.place_of_birth || "",
        height: values?.height || "",
        weight: values?.weight || "",
        tin: values?.tin || "",
        occupation: values?.occupation || "",
        monthly_salary: values?.monthly_salary || "",
        date_hired: values?.date_hired || "",
      });
    }
  }, [isOpen, values, civilStatusoptions]);
  return (
    <Modal size="lg" isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
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
          CEDULA
        </p>
      </ModalHeader>
      <ModalBody>
        <div className="d-flex flex-column gap-2">
          <Row>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Nationality</Label>
                <Select
                  options={CITIZENSHIP_OPTIONS}
                  value={details.citizenship} // whole object
                  onChange={(selected) =>
                    setDetails((prev) => ({ ...prev, citizenship: selected }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Civil Status</Label>
                <Select
                  options={civilStatusoptions}
                  value={details.civil_status}
                  onChange={(selected) =>
                    setDetails((prev) => ({ ...prev, civil_status: selected }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Place Of Birth</Label>
                <Input
                  type="text"
                  placeholder="Place of Birth"
                  value={details.place_of_birth}
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      place_of_birth: e.target.value,
                    }))
                  }
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Blood Type</Label>
                <Select
                  options={BLOOD_TYPE_OPTIONS}
                  value={details.blood_type}
                  onChange={(selected) =>
                    setDetails((prev) => ({ ...prev, blood_type: selected }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Height</Label>
                <Input
                  type="text"
                  placeholder="Height"
                  style={{ width: "100%" }}
                  value={details.height}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, height: e.target.value }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>weight</Label>
                <Input
                  type="text"
                  placeholder="Weight"
                  style={{ width: "100%" }}
                  value={details.weight}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, weight: e.target.value }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column ">
                <Label>TIN</Label>
                <Input
                  type="text"
                  placeholder="TIN"
                  style={{ width: "100%" }}
                  value={details.tin}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, tin: e.target.value }))
                  }
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Profession / Occupation</Label>
                <Input
                  type="text"
                  placeholder="Occupation"
                  style={{ width: "100%" }}
                  value={details.occupation}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      occupation: e.target.value,
                    }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Date Hired</Label>
                <Input
                  type="date"
                  placeholder="Date Hired"
                  style={{ width: "100%" }}
                  value={details.date_hired}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      date_hired: e.target.value,
                    }))
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="d-flex flex-column">
                <Label>Monthly Salary</Label>
                <Input
                  type="text"
                  placeholder="Monthly Salary"
                  style={{ width: "100%" }}
                  value={details.monthly_salary}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      monthly_salary: e.target.value,
                    }))
                  }
                />
              </InputGroup>
            </Col>
          </Row>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex text-end gap-2">
          <Button color="success" onClick={handleSave}>
            {" "}
            Save
          </Button>
          <Button color="danger" onClick={handleCancel}>
            {" "}
            Cancel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
