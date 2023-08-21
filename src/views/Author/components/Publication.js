/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../components/Loader";
import swal from 'sweetalert';
import { IconButton, Typography } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import UpdateFormulaire from "./updateFormulaire";

const Publication = ({
  author,
  publication,
  updatePublication,
  index,
  getProfile,
  platform,
  isFin,
  start,
  num_to_start,
  onNumeroChange
}) => {
  const { ApiServices, user, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService, userService } = ApiServices;

  const [noResultFound, setNoResultFound] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newNumero, setNewNumero] = useState(num_to_start);

  const getJournalDataa = async () => {
    if (publication.searchedFor) return;

    const journalName = publication.source
      ? publication.source
      : publication.extraInformation && publication.extraInformation["Journal"]
        ? publication.extraInformation["Journal"]
        : null;

    if (!journalName || !publication.year || publication.year.trim() === "") {
      console.log("No data");
      updatePublication(index, {
        ...publication,
        searchedFor: true,
      });
      return;
    }
    setIsLoading(true);

    try {
      console.log("jouranlName : ", journalName);

      const journalNameQuery = journalName.replace("/", "").replace("\\", "");

      const response = await scraperService.getJournalData(
        journalNameQuery,
        publication.year
      );


      if (response.data.error || response.data.status === 404) {
        setNoResultFound(true);
        updatePublication(index, {
          ...publication,
          searchedFor: true,
        });
      } else {
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          IF: response.data.journal["IF"],
          SJR: response.data.journal["SJR"],
          searchedFor: true,
        });

        const userP = user._id;
        const responseDB = userService.addSJR({
          id: userP,
          title: publication.title,
          IF: response.data.journal["IF"],
          SJR: response.data.journal["SJR"],
        })
      };


    } catch (e) {
      updatePublication(index, {
        ...publication,
        searchedFor: true,
      });
      pushAlert({
        message:
          "Incapable d'obtenir les données de la publication" +
          publication.title,
      });
    }

    setIsLoading(false);
  };

  useEffect(() =>{

  },[start])



  useEffect(() => {
    // let isMounted = true;
    // console.log("la valeur de isFin dans publication is " + canStart);
    if (isFin) {
      if (start) {
        if (!publication.IF && !publication.SJR && !publication.searchedFor)
          // setTimeout(() => {
            // if (isMounted) 
            getJournalData();
          // }, index * 1000);
      }
    }
    // return () => {
    //   isMounted = false;
    // };
  }, [isFin,start]);
  const [modalShow, setModalShow] = useState(false);
  const showModal = (props) => {
    setModalShow(true);
  }
  const hideModal = () => {
    setModalShow(false);
  }
  const [pub, setPub] = useState({
    _id: publication._id,
    auteur: publication.authors.join("; "),
    titre: publication.title,
    annee: publication.year,
    citation: publication.citation ? publication.citation.replace("*", "") : "",
    source: publication.source,
    IF: publication.IF ?? " ",
    SJR: publication.SJR ?? " ",
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

  const deletePub = async (e) => {
    var idPub = e.currentTarget.id;
    console.log(user._id);
    console.log(idPub)
    swal({
      title: "Confirmation",
      text: "Etes vous sur de vouloir supprimer cette publication ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willAdd) => {
        if (willAdd) {
          const userP = user._id;

          try {
            const response = userService.deletePub({
              idAuthor: user._id,
              idPub: idPub,

            });
            getProfile();
            swal("La publication est supprimée", {
              icon: "success",
            });

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

  }

  const updatePub = () => {

    swal({
      title: "Confirmation",
      text: "Etes vous sur de vouloir modifier cette publication ?",
      icon: "warning",
      buttons: true,
    })
      .then(async (willAdd) => {
        if (willAdd) {
          const userP = user._id;

          try {
            const response = userService.updatePub({
              idAuthor: userP,
              id_: publication._id,
              authors: pub.auteur.split(";"),
              title: pub.titre,
              citation: pub.citation,
              year: pub.annee,
              source: pub.source,
              IF: pub.IF,
              SJR: pub.SJR



            });
            console.log(userP + publication._id + pub.titre)
            getProfile();
            swal("La publication est modifiée", {
              icon: "success",
            });
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


  const getJournalData = async () => {

    setIsLoading(true)

    const ws = new WebSocket('ws://localhost:2000');
    //  const ws = new WebSocket('wss://rs-scraper-master.onrender.com/'); // Remplacez l'URL en conséquence

    const journalName = publication.source
      ? publication.source
      : publication.extraInformation && publication.extraInformation["Journal"]
        ? publication.extraInformation["Journal"]
        : null;

    const journalNameQuery = journalName.replace("/", "").replace("\\", "");
    const year = publication.year

    try {
      ws.onopen = () => {
        console.log('WebSocket connection opened in publication react js');
        const paramts = {
          journalName: journalNameQuery,
          year: year
        };

        // setTimeout(() => {
        ws.send(JSON.stringify(paramts));
        // }, 10000); // 10000 ms = 10 secondes
      }
    }
    catch (error) {
      console.log("error Publication Year" + error);
    }

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        console.log(receivedData.SJR);
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          // IF: receivedData.SJR,
          SJR: receivedData.SJR,
          searchedFor: true,
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false)
        setIsFetched(false)
      }
      let n = newNumero+1
      setNewNumero(n)
      onNumeroChange(n)
      // console.log(" la nouvelle valeur de numero = " +n);
    }
  }


  const fetchedButton = (
    <button
      className="btn  btn-sm m-3 btn-outline-secondary "
      onClick={getJournalData}
    >
      récupérer
    </button>
  );
  return (
    <>
      <tr style={{ whiteSpace: "break-spaces " }} key={publication.title}>
        <td style={{ width: "60%" }}>
          {publication.title} 
          {publication.authors && (
            <small
              style={{ whiteSpace: "break-spaces " }}
              className="d-block text-muted text-truncate mt-n1"
            >
              {publication.authors.join(", ")}
            </small>
          )}

          {publication.source && (
            <small
              style={{ whiteSpace: "break-spaces " }}
              className="d-block text-muted text-truncate mt-n1"
            >
              {publication.source}
            </small>
          )}

          {publication.extraInformation &&
            publication.extraInformation["Conference"] && (
              <small
                style={{ whiteSpace: "break-spaces " }}
                className="d-block text-muted text-truncate mt-n1"
              >
                {publication.extraInformation["Conference"]}
              </small>
            )}

          {publication.extraInformation &&
            publication.extraInformation["Journal"] && (
              <small
                style={{ whiteSpace: "break-spaces " }}
                className="d-block text-muted text-truncate mt-n1"
              >
                {publication.extraInformation["Journal"]}
              </small>
            )}
        </td>
        <td className="text-center">{publication.year ?? ""}</td>
        <td className="text-center">
          {publication.citation ? publication.citation.replace("*", "") : ""}
        </td>
        <td className="text-center">
          {publication.IF ?? " "}
          {isLoading && <Loader size="25" />}
        </td>
        <td className="text-center">
          {publication.SJR ?? " "}
          {isLoading && <Loader size="25" />}
        </td>
        <td className="text-center">
          {noResultFound && " "}
          {!isLoading && fetchedButton}
        </td>
        <td>
          <IconButton id={publication._id}
            size="small" color="primary" component="span"
            onClick={showModal}>
            <UpdateIcon />
          </IconButton>
        </td>
        <td>

          <IconButton id={publication._id}
            size="small" color="secondary" component="span"
            onClick={deletePub}>
            <DeleteIcon />
          </IconButton>
        </td>
      </tr>
      <UpdateFormulaire show={modalShow} hideModal={hideModal} pub={pub}
        setPub={setPub} clearInputs={clearInputs} updatePub={updatePub}
      />
    </>
  );
};

export default Publication;
