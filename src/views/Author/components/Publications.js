import React, { useEffect, useState, useContext, useRef } from "react";
import Publication from "./Publication";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddFormulaire from "./addformulaire";
import { AppContext } from "../../../context/AppContext";
import swal from 'sweetalert';

import $ from "jquery";
import "datatables";

const Publications = ({ author, setAuthor, platform, getProfile, data, isFin, user_id, fromProfile}) => {
  const { ApiServices, user, setUser, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService } = ApiServices;
  const tableRef = useRef(null);
  const [numToStar, setNumToStart] = useState(0)

  const handleNumeroChange = (newNumero) => {
    setNumToStart(newNumero);
    let num = numToStar + 1
    console.log(num);
    setNumToStart(num)
  };
  useEffect(() => {

  }, [numToStar])

  useEffect(() => {
    // const table = $(tableRef.current).DataTable();
    // console.log("la valeur de is fin dans publiations is "+ isFin);
    console.log(data.length + " = la longueur de liste de publications");
    console.log("etat de isfin est :"+ isFin);
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


  }, [isFin]);

  const updatePublication = (index, publication) => {
    const i = author.publications.map(p => p.title).indexOf(publication.title);
    let tempPublications = author.publications;
    tempPublications[i] = publication;
    setAuthor(() => ({
      ...author,
      publications: tempPublications,
    }));
  };


  const [modalShow, setModalShow] = useState(false);
  const showModal = () => {
    setModalShow(true);
  }
  const hideModal = () => {
    setModalShow(false);
  }
  const [pub, setPub] = useState({
    auteur: "",
    titre: "",
    annee: "",
    citation: "",
    source: "",
    IF: "",
    SJR: "",
  });

  const clearInputs = () => {
    setPub({
      auteur: "",
      titre: "",
      annee: "",
      citation: "",
      source: "",
      IF: "",
      SJR: "",
    });
  };
  const addpublication = () => {

    swal({
      title: "Confirmation",
      text: "Etes vous sur de vouloir ajouter cette publication ?",
      icon: "warning",
      buttons: true,
    })
      .then(async (willAdd) => {
        if (willAdd) {
          const userP = user._id;

          try {
            const response = userService.addPub({
              idAuthor: userP,
              authors: pub.auteur.split(";"),
              title: pub.titre,
              citation: pub.citation,
              year: pub.annee,
              source: pub.source,
              IF: pub.IF,
              SJR: pub.SJR



            });
            getProfile();
            swal("La publication est bien ajoutée", {
              icon: "success",
            });
            clearInputs();
            hideModal();
            if (response.data) {
              pushAlert({
                type: "success",
                message: "Le mot de passe a été mis à jour",
              });

            } else throw Error();
          } catch (e) {
            pushAlert({
              message: "Incapable de mettre à jour la photo de profil",
            });
          }

        } else {
          swal("l'operation est annulée");

        }
      });
  };

  // useEffect(() => {
  //   if (canReload) {
  //     window.location.reload()
  //   } else {
  //     canReload = false
  //   }
  // }, [canReload]);

  useEffect(() => {
  
    if (author.publications && fromProfile) {
      $("#myTable").DataTable({"order": [[1, "desc"]]});
    }
  }, [author.publications]);
  
  

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap" id="myTable">
          <thead>
            <tr>
              <th>Titre<IconButton onClick={() => showModal()} aria-label="delete">
                <AddIcon />
              </IconButton></th>
              <th className="text-center">Année</th>
              <th className="text-center">Citée</th>
              <th className="text-center">JIF QUARTILE</th>
              <th className="text-center">SJR</th>
              <th className="text-center">
                Récupération <br /> des données
              </th>
              <th>modifier</th>
              <th>supprimer</th>
            </tr>
          </thead>
          <tbody>
            {author.publications &&
              author.publications
                .sort((a, b) => b.title - a.title)
                .map((publication, index) => (
                  <Publication
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
      <AddFormulaire show={modalShow} hideModal={hideModal} pub={pub}
        setPub={setPub} addpublication={addpublication} clearInputs={clearInputs}
      />

    </div>
  );
};

export default Publications;
