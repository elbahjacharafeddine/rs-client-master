import React from "react";

const UserPicture = ({ user, size, badge }) => {

  return (
    <div className="col-auto">
      {(user.profilePicture instanceof Object && user.profilePicture.data!= undefined)? (<span
        className={`avatar avatar-${size}`}
        style={{
          backgroundImage: `url("data:${user.profilePicture.mimetype};base64,${btoa( new Uint8Array(user.profilePicture.data.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          )}")`,
        }}
      >
        {badge && <span className="badge bg-green"></span>}
      </span>) : (
        <span className={`bg-blue-lt avatar avatar-${size}`}
          style={{
            backgroundImage: `url("https://ui-avatars.com/api/?name=${user.firstName + "+" + user.lastName}")`,
          }}
        >
          {user.firstName ? user.firstName[0] : ""}
          {user.lastName ? user.lastName[0] : ""}
        </span>
      )}

    </div>
  );
};

export default UserPicture;
