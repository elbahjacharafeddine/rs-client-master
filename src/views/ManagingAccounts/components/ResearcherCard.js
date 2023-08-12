import React from "react";
import { Link } from "react-router-dom";

const ResearcherCard = ({ researcher }) => {
  return (
    <div className="col-md-6 ">
      <div className="card">
        <div className="card-body">
          <div className="row row-sm align-items-center">
            <div className="col-auto">
              {researcher.id && (
                <span
                  className="avatar  avatar-md "
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://scholar.google.com/citations?view_op=medium_photo&user=" +
                      researcher.id +
                      ")",
                  }}
                ></span>
              )}
              {!researcher.id && (
                <span className="avatar  bg-blue-lt avatar-md ">
                  {researcher.firstName ? researcher.firstName[0] : ""}
                  {researcher.lastName ? researcher.lastName[0] : ""}
                </span>
              )}
            </div>
            <div className="col" style={{ minWidth: "auto" }}>
              <h3 className="mb-0">
                <Link to={"/profile/" + researcher.user_id}>
                  {`${researcher ? researcher.firstName : ""} ${
                    researcher ? researcher.lastName : ""
                  }`}
                </Link>
              </h3>
              <div className="text-muted text-h5">
                {researcher.email
                  ? "e-mail validée de " + researcher.email
                  : ""}
              </div>
            </div>
            <div className="col-auto lh-1 align-self-start">
              <span className="badge bg-blue-lt">
                {researcher.publications.length} publications
              </span>
            </div>

            <div className="text-muted pl-2 p-1 text-h5">
              {researcher.university ?? ""}
            </div>
          </div>
          <div className="row align-items-center mt-1">
            <div className="col">
              <div>
                <h6 className="h5">intérêts </h6>
                <div className="inline-block  mb-0">
                  {researcher.interests.map((interest, index) => (
                    <span key={index} className="badge bg-blue-lt  mr-2">
                      {interest.length > 40
                        ? interest.substr(1, 40).concat("...")
                        : interest}
                    </span>
                  ))}
                </div>
                <h6 className="h5">Coauteurs </h6>
                <div className="avatar-list   avatar-list-stacked mb-0">
                  {researcher.coauthors.map((coauthor, index) => (
                    <Link key={index} to={"/author-research/" + coauthor.name}>
                      <span className="avatar bg-blue-lt avatar-sm">
                        {coauthor.name.split(" ")[0][0]}
                        {coauthor.name.split(" ")[1][0]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherCard;
