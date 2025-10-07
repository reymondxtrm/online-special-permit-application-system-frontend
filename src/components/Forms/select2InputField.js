import React from "react";
import { Col, Label } from "reactstrap";
import Select from "react-select";
const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px 1px 1px 1px solid #f46a6a",
    boxShadow: "1px 1px 1px 1px #f46a6a",
  }),
};
const Select2Input = ({ id, placeholder, validation, options, isMulti }) => {
  return (
    <>
      <Select
        isMulti={isMulti ? true : false}
        styles={
          validation.touched[id] && validation.errors[id] ? customStyles : ""
        }
        isClearable="true"
        name={id}
        placeholder={placeholder}
        onBlur={() => {
          validation.handleBlur({ target: { name: id } });
        }}
        options={options}
        value={validation.values[id] || null}
        aria-invalid={
          validation.touched[id] && validation.errors[id] ? true : false
        }
        classNamePrefix="select2-selection"
      />
    </>
  );
};

export default Select2Input;
