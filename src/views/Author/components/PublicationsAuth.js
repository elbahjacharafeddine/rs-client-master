import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import PublicationAuth from "./PublicationAuth";
import Publication from "./Publication";
import $ from "jquery";
import "datatables";

const PublicationsAuth = ({author, setAuthor, platform, getProfile, data, isFin, user_id, fromProfile }) => {
  const { ApiServices, user, setUser, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService } = ApiServices;
  const [numToStar, setNumToStart] = useState(0)

  const handleNumeroChange = (newNumero) => {
    setNumToStart(newNumero);
    let num = numToStar + 1
    setNumToStart(num)
  };
  
  useEffect(() => {

  }, [numToStar])


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
 

  // useEffect(() => {
  //   if (canReload) {
  //     window.location.reload()
  //   } else {
  //     canReload = false
  //   }
  // }, [canReload]);

  useEffect(() => {
    // var table = $('#myT').DataTable();

    // if (table != null) {
    //     table.destroy();
    // }
    // if (author.publications && fromProfile) {
    //   $("#myT").DataTable({"order": [[1, "desc"]]});
    // }
  }, [author.publications]);
  
  


  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap" id="myT">
          <thead>
            <tr>
              <th>Titre</th>
              <th className="text-center">Année</th>
              <th className="text-center">Citée</th>
              <th className="text-center">JIF QUARTILE</th>
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
                  isFin={isFin}
                  start={index === numToStar}
                  num_to_start={numToStar}
                  onNumeroChange={handleNumeroChange}
                  user_id={user_id}
                  />
                ))}
          </tbody>
        </table>
      </div>
     
    </div>
  );
};

export default PublicationsAuth;
