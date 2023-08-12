import React from "react";

const PageHeader = ({ title, subTitle }) => (
  <div className="page-header">
    <div className="row align-items-center">
      <div className="col-auto">
        <h2 className="page-title">{title}</h2>
      </div>
      <div className="col-auto ml-auto d-print-none"></div>
      <div className="col-auto">
        <div className="text-muted text-h5 mt-2">{subTitle ?? ""}</div>
      </div>
    </div>
  </div>
);

export default PageHeader;
