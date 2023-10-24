import React from "react";

const HeaderPage = ({...props}) => {
  return (
    <div className="flex justify-between items-center mb-8"> 
      <h1 className="text-white text-2xl p-3">{props.title}</h1> 
    </div>
  );
};

export default HeaderPage;
