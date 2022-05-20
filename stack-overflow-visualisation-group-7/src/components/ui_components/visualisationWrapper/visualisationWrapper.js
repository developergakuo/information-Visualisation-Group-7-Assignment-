import React from 'react';

const VisaulisationWrapper = (props) => {
  return (
        <div className ='VisaulisationWrapper'>
          <h2>{props.title}</h2>
          {props.children}
        </div>
  );
};

export default VisaulisationWrapper;