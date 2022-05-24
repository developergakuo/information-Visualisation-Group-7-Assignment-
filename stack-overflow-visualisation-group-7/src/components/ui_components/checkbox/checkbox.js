import * as React from "react";

const Checkbox = ({ id, label, value, onChange }) => {
  return (
    <label>
      <input id={id} type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};
export default Checkbox;
