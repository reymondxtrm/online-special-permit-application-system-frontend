import React from "react";
import { Col, Label, Input, FormFeedback } from "reactstrap";
const BasicInputField = ({
  col,
  label,
  name,
  validation,
  placeholder,
  value,
  type,
  required = false,
  disable = false,
}) => {
  return (
    <Col md={col}>
      <div className="mb-3">
        {label ? (
          <Label className="form-label">
            {label}
            {required && <span style={{ color: "red" }}>&nbsp;*</span>}
          </Label>
        ) : null}
        <input
          disabled={disable}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={value || ""}
        />
      </div>
    </Col>
  );
};

export default BasicInputField;
