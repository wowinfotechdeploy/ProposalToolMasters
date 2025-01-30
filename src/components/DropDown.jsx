import React from "react";
import Select from "react-select";

const DropDown = (props) => {
  return (
    <Select
      className={props.className}
      defaultValue="Select..."
      options={props.options} // Access DialCode from the imported module
      value={props.value}
      onChange={props.onChange}
      isDisabled={props.disabled}
      placeholder={props.placeholder}
    />
  );
};

export default DropDown;
