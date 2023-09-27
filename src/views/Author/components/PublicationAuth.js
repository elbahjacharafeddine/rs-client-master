/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../components/Loader";



const PublicationAuth = ({
  author,
  publication,
  updatePublication,
  index,
  getProfile,
  platform,
  isFin,
  start,
  num_to_start,
  onNumeroChange,
  user_id
}) => {
  const { ApiServices, user, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService, userService } = ApiServices;

  const [noResultFound, setNoResultFound] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newNumero, setNewNumero] = useState(num_to_start);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {

  }, [start])



  useEffect(() => {
    if (isFin) {
      if (start) {
        if (!publication.IF && !publication.SJR && !publication.searchedFor) { getJournalData(); }
        else {
          let n = newNumero + 1
          onNumeroChange(n)
        }
      }
    }

  }, [isFin, start]);





  const getJournalData = async () => {

    setIsLoading(true)

    const ws = new WebSocket(apiUrl);
    // const ws = new WebSocket('wss://rs-scraper-master.onrender.com/');

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

    ws.onmessage = async (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        console.log(receivedData);
        console.log(receivedData.SJR);
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          IF: receivedData.IF,
          SJR: receivedData.SJR,
          searchedFor: true,
        });
        // if (user_id) {
          const SJR = {
            id:user_id,
            title: publication.title,
            SJR: receivedData.SJR,
            IF: receivedData.IF,
            year: publication.year
          }
          console.log(SJR);
          const res = await userService.addSJR(SJR)
          console.log("update for SJR :");
          // console.log(res);
          if (res.status==200) {
            console.log("saved with succes");
          }
          else {
            console.log("not yet ...");
          }
        // }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false)
        setIsFetched(false)
      }
      let n = newNumero + 1
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
          {fetchedButton}
        </td>
      </tr>
    </>
  );
};

export default PublicationAuth;
