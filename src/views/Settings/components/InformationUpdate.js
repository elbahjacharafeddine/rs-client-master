/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import UserPicture from "../../components/UserPicture";
import BounceLoader from "react-spinners/BounceLoader";

function InformationUpdate({
  accountInformations,
  setAccountInformations,
  updateAccountInformations,
  profilePicture,
  setProfilePicture,
  updateProfilePicture,
  loading,
  color
}) {
  const { user, UserHelper, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  

  useEffect(() => {
    setAccountInformations({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }, [user]);

  const handleAccountInformationsChange = (event) => {
    event.persist();
    setAccountInformations((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  return (
    <div className="col-md-8">
      <div style={{
        position: "fixed",
        zIndex: "999",
        height: "2em",
        width: "4em",
        overflow: "show",
        margin: "auto",
        top: "0",
        left: "0",
        bottom: "0",
        right: "0",
      }}>
        <BounceLoader color={color} loading={loading} size={100} />

      </div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Mise à jour du compte</h3>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row mb-3">
              <div className="col-auto">
                <UserPicture
                  user={{
                    ...accountInformations,
                    profilePicture: user.profilePicture,
                  }}
                  size={"lg"}
                />
              </div>
              <div className="col-md-7">
                <div className="mb-3">
                  <div className="form-file">
                    <input
                      type="file"
                      className="form-file-input"
                      id="customFile"
                      onChange={handleProfilePictureChange}
                    />
                    <label className="form-file-label" for="customFile">
                      <span className="form-file-text">
                        {profilePicture
                          ? profilePicture.name
                          : "Choose file..."}
                      </span>
                      <span className="form-file-button">Parcourir</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <button
                    className=" btn btn-primary"
                    onClick={updateProfilePicture}>
                    Update
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Role</label>
              <input
                disabled
                className="form-control"
                value={UserHelper.userShortBio(user)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Prénom</label>
              <input
                className="form-control"
                placeholder="First name"
                onChange={handleAccountInformationsChange}
                value={accountInformations.firstName}
                name="firstName"
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Nom de famille</label>
              <input
                className="form-control"
                placeholder="Last name"
                onChange={handleAccountInformationsChange}
                value={accountInformations.lastName}
                name="lastName"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Adresse e-mail</label>
              <input
                className="form-control"
                placeholder="your-email@domain.com"
                onChange={handleAccountInformationsChange}
                value={accountInformations.email}
                name="email"
              />
            </div>
            <div className="form-footer">
              <button
                className="btn btn-primary"
                onClick={updateAccountInformations}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InformationUpdate;
