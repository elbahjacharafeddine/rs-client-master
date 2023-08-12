/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";

import { AppContext } from "../../context/AppContext";
import UserListItem from "../Author/components/UserListItem";
import { Link } from "react-router-dom";
import swal from 'sweetalert';
import BounceLoader from "react-spinners/BounceLoader";

const Researchers = () => {
  const [researchers, setResearchers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#1e90ff");

  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService } = ApiServices;

  const updateData = useCallback(async () => {
    try {
      const response = await userService.getResearchers();
      if (response.data) {
        /*const filteredResearchers = response.data.filter(
          (researcher) => researcher.creatorId === user._id
        );*/
        setResearchers(response.data);
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données des chercheurs" });
    }
  }, [user._id]);

  useEffect(() => {
    updateData();
  }, [updateData, user._id]);

  const handleEmailChange = (event) => {
    event.persist();
    setNewEmail(event.target.value);
  };

  const handleSubmit = async (e) => {
    const password = Math.random().toString(36).slice(-8);
    swal({
      title: "Confirmation",
      text: "Etes vous sur de vouloir inviter cet utilisateur ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          setLoading(true)
          const response = await userService.createUser({
            email: newEmail,
            password,
            roles: "RESEARCHER",
            creatorId: user._id,
          });
          if (response.data){
            updateData();
            setLoading(false)

          } else throw Error();
          swal("L'email à été envoyer avec succès", {
            icon: "success",
          });
        } catch (error) {
          pushAlert({ message: "Incapable de créer l'utilisateur" });
        }
      } else {
        swal("Abortion du transaction!");
      }
    });



  };

  return (
    <div className="container">
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
      <PageHeader title="Géstion des comptes des chercheurs" />
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Creation des comptes chef de laboratoire
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-xl-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Email de chef de laboratoire
                    </label>
                    <div className="input-group mb-2">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="example@domaine.com"
                        onChange={handleEmailChange}
                        value={newEmail.email}
                        name="email"
                      />
                      <span className="input-group-append">
                        <button
                          onClick={handleSubmit}
                          className="btn btn-secondary"
                          type="button"
                        >
                          Créer
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card ">
            <div className="card-header">
              <h3 className="card-title">Comptes invités</h3>
            </div>
            <div className="card-body p-0">
              <div
                style={{ height: "300px", maxHeight: "300px" }}
                className="list overflow-auto list-row list-hoverable"
              >
                {researchers
                  .filter(
                    (laboratoryHead) =>
                      laboratoryHead && !laboratoryHead.hasConfirmed
                  )
                  .map((laboratoryHead, index) => (
                    <div className="list-item" key={index}>
                      <Link
                        to={"/profile/" + laboratoryHead._id}
                        className="text-body d-block"
                      >
                        {laboratoryHead.email}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card ">
            <div className="card-header">
              <h3 className="card-title">Comptes confirmés</h3>
            </div>
            <div className="card-body p-0">
              <div
                style={{ height: "300px", maxHeight: "300px" }}
                className="list  overflow-auto list-row list-hoverable"
              >
                {researchers
                  .filter((user) => user && user.hasConfirmed)
                  .map(({ email, ...laboratoryHead }, index) => (
                    <UserListItem
                      key={index}
                      user={laboratoryHead}
                      subTitle={email}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Researchers;
