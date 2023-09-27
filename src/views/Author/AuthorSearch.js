/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useCallback } from "react";

import { useParams } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import PageHeader from "../components/PageHeader";
import AuthorCard from "./components/AuthorCard";
import Loader from "../components/Loader";

import NoResultFound from "../components/NoResultFound";
import LoadingResult from "../components/LoadingResult";
import ErrorFound from "../components/ErrorFound";

const AuthorSearch = () => {
  let { authorName } = useParams();

  const [authors, setAuthors] = useState([]);
  const [noResultFound, setNoResultFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService } = ApiServices;

  const apiUrl = process.env.REACT_APP_API_URL

  const authorSearch = useCallback(async () => {
    const authorNamePath = authorName.replace(" ", "%20");

    try {
      setIsLoading(true);
      const response = await scraperService.authorSearch(authorNamePath);

      if (response.data.authors) {
        if (authors.length) setAuthors([]);
        setNoResultFound(false);
        setIsError(false);
        setAuthors(response.data.authors);
      } else if (response.data.error) setNoResultFound(true);
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de rechercher" });
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [authorName, isError, noResultFound]);


  const authorSearchh = useCallback(async() =>{
    const authorNamePath = authorName.replace(" ", "%20");
      setIsLoading(true)
      const ws = new WebSocket(apiUrl)
      try {
        ws.onopen = () => {
          console.log('WebSocket connection opened to search about '+ authorNamePath);
          const author = {
            authorName: authorNamePath
          }
          ws.send(JSON.stringify(author))
        };
  
        ws.onmessage = (event) => {
          const receivedData = JSON.parse(event.data);
          console.log(receivedData);
          if(receivedData.error){
            console.log(receivedData.error);
            setNoResultFound(true);
            setIsLoading(false)
          }
          else if(receivedData){
            setAuthors(receivedData);
            setNoResultFound(false);
            setIsError(false);
            setIsLoading(false);
          }
        }  
      }
     catch (error) {
      console.log("error");
    }
  },[])

  useEffect(() => {
    if (authors.length) setAuthors([]);
    if (noResultFound) setNoResultFound(false);
    if (isError) setIsError(false);

    authorSearchh();
  }, [authorName]);

  return (
    <div className="container">
      <PageHeader
        title={"Chercher l'auteur : " + authorName}
        subTitle={authors.length ? authors.length + " chercheurs" : ""}
      />
      {isLoading && <LoadingResult />}
      {noResultFound && <NoResultFound query={authorName} />}
      {isError && <ErrorFound />}

      <div className="row">
        {authors.map((author, index) => (
          <AuthorCard key={index} author={author} />
        ))}
      </div>
    </div>
  );
};

export default AuthorSearch;
