import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserPicture from "../../components/UserPicture";

const GeneratedUser = ({ user }) => (
  <div className=" col-xl-6">
    <Link to={`/profile/${user._id}`} className="card card-link">
      <div className="card-body">
        {user.hasConfirmed && (
          <div className="row row-sm align-items-center">
            <UserPicture user={user} size="md" />

            <div className="col">
              <h4 className="mb-0">
                {user.firstName ? user.firstName : ""}{" "}
                {user.lastName ? user.lastName : ""}
              </h4>
              <div className="text-muted text-h6">
                {user.email ? user.email : ""}
              </div>
            </div>
          </div>
        )}
        {!user.hasConfirmed && (
          <div className="mb-1 mt--1 pt-3">
            <div className="text-muted text-center pb-3">
              {user.email ? user.email : ""}
            </div>
            <ToggledPassword password={user.generatedPassword} />
          </div>
        )}
      </div>
    </Link>
  </div>
);

const ToggledPassword = ({ password }) => {
  const [passwordIsClear, setPasswordIsClear] = useState(false);

  const togglePasswordClair = (event) => {
    event.preventDefault();
    setPasswordIsClear(!passwordIsClear);
  };

  return (
    <div className="input-group input-group-flat ">
      <input
        type={passwordIsClear ? "text" : "password"}
        className="form-control"
        value={password}
      />
      <div className="input-group-append">
        <span className="input-group-text">
          <a
            onClick={togglePasswordClair}
            href="/#"
            className="input-group-link"
          >
            {passwordIsClear ? "Hide password" : "Show password"}
          </a>
        </span>
      </div>
    </div>
  );
};
export default GeneratedUser;
