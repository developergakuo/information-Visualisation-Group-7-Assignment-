import React from "react";

const MissingVisaulisationWrapper = (props) => {
  return (
    <div className="missingVisaulisationWrapper">
      <h2>{props.title}</h2>

      {props.subTitle && <h5>({props.subTitle})</h5>}
      {props.children}
    </div>
  );
};

export default MissingVisaulisationWrapper;
