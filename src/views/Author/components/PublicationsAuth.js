import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import PublicationAuth from "./PublicationAuth";

const PublicationsAuth = ({ author, setAuthor, platform, getProfile }) => {
  const { ApiServices, user, setUser, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService } = ApiServices;
  useEffect(() => {
    setTimeout(() => {
      const publicationsTmp = author.publications.map((p) => ({
        ...p,
        searchedFor: true,
      }));
      setAuthor(() => ({
        ...author,
        publications: publicationsTmp,
      }));
    }, author.publications.length * 4000);
  }, []);

  const updatePublication = (index, publication) => {
    const i = author.publications.map(p => p.title).indexOf(publication.title);
    let tempPublications = author.publications;
    tempPublications[i] = publication;
    setAuthor(() => ({
      ...author,
      publications: tempPublications,
    }));
  };
 

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap ">
          <thead>
            <tr>
              <th>Titre</th>
              <th className="text-center">Année</th>
              <th className="text-center">Citée</th>
              <th className="text-center">IF</th>
              <th className="text-center">SJR</th>
              <th className="text-center">
                Récupération <br /> des données
              </th>
            </tr>
          </thead>
          <tbody>
            {author.publications &&
              author.publications
                .sort((a, b) => b.title - a.title)
                .map((publication, index) => (
                  <PublicationAuth
                    getProfile={getProfile}
                    index={index}
                    platform={platform}
                    key={index}
                    publication={publication}
                    updatePublication={updatePublication}
                    author={author}
                  />
                ))}
          </tbody>
        </table>
      </div>
     
    </div>
  );
};

export default PublicationsAuth;
