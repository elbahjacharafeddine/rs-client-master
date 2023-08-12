import React from "react";
import image from "../../assets/images/illustrations/undraw_no_result_found.svg";
import Loader from "./Loader";

const LoadingResult = () => (
  <div className="container empty">
    <div className="empty-icon">
      <img src={image} className="h-8 mb-4" alt="" />
    </div>
    <p className="empty-title h3">Chargement... </p>
    <p className="empty-subtitle text-muted">
      Nous traitons votre demande, veuillez patienter ...
    </p>
    <div className="m-4">
      <Loader size={50} />
    </div>
  </div>
);

export default LoadingResult;
