import React from "react";
import image from "../../assets/images/illustrations/undraw_no_result_found.svg";

const NoResultFound = ({ query }) => (
  <div className="container empty">
    <div className="empty-icon">
      <img src={image} className="h-8 mb-4" alt="" />
    </div>
    <p className="empty-title h3">
      Aucun résultat trouvé {query ? "pour " + query : ""}
    </p>
    <p className="empty-subtitle text-muted">
      Essayez d'ajuster votre recherche ou votre filtre
    </p>
  </div>
);

export default NoResultFound;
