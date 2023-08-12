import React, { useState, useContext } from "react";
import InformationUpdate from "./components/InformationUpdate";
import PasswordUpdate from "./components/PasswordUpdate";
import { AppContext } from "../../context/AppContext";

import { useHistory } from "react-router-dom";

function AccountSettings() {
  const history = useHistory();

  const { ApiServices, user, setUser, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService } = ApiServices;
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#1e90ff");

  const [passwordUpdate, setPasswordUpdate] = useState({
    courantPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const [accountInformations, setAccountInformations] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const updateAccountInformations = async () => {
    try {
      const response = await userService.updateUser({
        ...accountInformations,
        _id: user._id,
      });

      if (response.data) {
        setUser({
          ...user,
          ...accountInformations,
          hasConfirmed: true,
        });

        pushAlert({
          type: "success",
          message: "Les informations du compte ont été mises à jour",
        });
      } else {
        throw Error();
      }
    } catch (e) {
      pushAlert({
        message: "Incapable de mettre à jour les informations de compte",
      });
    }
  };

  const updatePassword = async () => {
    const { newPassword, confirmedNewPassword } = passwordUpdate;

    if (newPassword !== confirmedNewPassword) {
      pushAlert({
        message: "Les deux mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      const response = await userService.updatePassword(user._id, {
        password: newPassword,
      });

      if (response.data) {
        pushAlert({
          type: "success",
          message: "Le mot de passe a été mis à jour",
        });
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      } else throw Error();
    } catch (e) {
      pushAlert({
        message: "Incapable de mettre à jour la photo de profil",
      });
    }
  };

  const updateProfilePicture = async () => {
    const formData = new FormData();
    formData.append("file", profilePicture);
    try {
      setLoading(true)
      const response = await userService.updateProfilePicture(formData);
      if (response.data) {
        setUser({
          ...user,
          profilePicture: response.data.profilePicture,
        });
        pushAlert({
          type: "success",
          message: "La photo de profil a été mis à jour",
        });
        setProfilePicture(null)
        setLoading(false)
      } else throw Error();
    } catch (e) {
        pushAlert({
        message: "Incapable de mettre à jour la photo de profil",
      });
    }
  };

  return (
    <div className="row">
      <InformationUpdate
        accountInformations={accountInformations}
        setAccountInformations={setAccountInformations}
        updateAccountInformations={updateAccountInformations}
        setProfilePicture={setProfilePicture}
        profilePicture={profilePicture}
        updateProfilePicture={updateProfilePicture}
        loading={loading}
        color={color}
      />
      <PasswordUpdate
        passwordUpdate={passwordUpdate}
        setPasswordUpdate={setPasswordUpdate}
        updatePassword={updatePassword}
      />
    </div>
  );
}

export default AccountSettings;
