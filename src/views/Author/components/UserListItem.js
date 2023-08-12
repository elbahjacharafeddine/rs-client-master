import UserPicture from "../../components/UserPicture";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const UserListItem = ({ user, subTitle }) => {
  return (
    <Fragment>
      <div className="list-item ">
        <UserPicture user={user} size="md" />
        <div className="text-truncate">
          <Link to={"/profile/" + user._id} className="text-body d-block">
            {`${user.firstName} ${user.lastName}`}
          </Link>
          <small className="d-block text-muted text-truncate mt-n1">
            {subTitle}
          </small>
        </div>
      </div>
    </Fragment>
  );
};

export default UserListItem;
