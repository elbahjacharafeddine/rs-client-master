/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useEffect,
    useContext,
    useState,
    Fragment,
    useCallback,
  } from "react";
  import { useParams } from "react-router-dom";
  import { AppContext } from "../../context/AppContext";
  import Publications from "../Author/components/Publications";
  import AuthorCitations from "../Author/components/AuthorCitations";
  import Coauthors from "../Author/components/Coauthors";
  import ProfileHeader from "./components/ProfileHeader";
  import PublicationsAuth from "../Author/components/PublicationsAuth";
  
  const MyProfil = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [correspondingFollowedUser, setCorrespondingFollowedUser] = useState(
      null
    );
    const [correspondingFollowedUserCitation, setCorrespondingFollowedUserCitation] = useState(
      null
    );
    const { ApiServices, user, alertService } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { userService, scraperService } = ApiServices;
    useEffect(() => {
      getProfile();
      // updateCitation();
    }, [id]);
  
    const getProfile = useCallback(async () => {
      try {
  
        const response = await userService.findUser(id);
        if (response.data) {
          setProfileUser(response.data);
          setCorrespondingFollowedUser(response.data.correspondingFollowedUser);
          setCorrespondingFollowedUserCitation(response.data.correspondingFollowedUser);
        } else throw Error();
      } catch (error) {
        pushAlert({ message: "Incapable d'obtenir les données de profil" });
      }
    }, [id]);

  
    const showData = () => {
      console.log(profileUser.correspondingFollowedUser.publications);
    }
  
  
    return (
      <div className="container">
        {profileUser !== null && (
          <Fragment>
            {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
              <div className="row">
                <div className="col-md-8">
                  {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
                    <Fragment>
                      <ProfileHeader
                        profile={{
                          ...correspondingFollowedUser,
                          ...profileUser,
                        }}
                      />
                      {(() => {
                        if (id == user._id) {
                          return (
                            <Publications
                              author={correspondingFollowedUser}
                              setAuthor={setCorrespondingFollowedUser}
                              getProfile={getProfile}
                              data={profileUser.correspondingFollowedUser.publications}
                              isFin={true}
                              user_id={id}
                              fromProfile={true}
                            />
                          )
                        } 
                      })()}
  
                    </Fragment>
                  )}
                </div>
                <div className="col-md-4">
                  <AuthorCitations author={correspondingFollowedUserCitation} />
                  <Coauthors author={correspondingFollowedUser} />
                </div>
              </div>
            )}
          </Fragment>
        )}
      </div>
    );
  
  
  };
  
  export default MyProfil;
  