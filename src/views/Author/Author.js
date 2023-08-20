/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  Fragment,
} from "react";

import { useParams, useLocation, json } from "react-router-dom";

import AuthorHeader from "./components/AuthorHeader";
import Coauthors from "./components/Coauthors";
import AuthorCitations from "./components/AuthorCitations";
import Publications from "./components/Publications";

import { AppContext } from "../../context/AppContext";
import NoResultFound from "../components/NoResultFound";
import LoadingResult from "../components/LoadingResult";
import ErrorFound from "../components/ErrorFound";


import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import DataTableComponent from "../DataTableComponent";


const Author = (props) => {
  const [messages, setMessages] = useState([]);
  const { platform, authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isAllowedToFollow, setIsAllowedToFollow] = useState(false);
  const [isSendingFollow, setsSendingFollow] = useState(false);
  const [users, setUsers] = useState([]);
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService, userService, teamService } = ApiServices;

  const [serverError, setServerError] = useState(false)
  const [chargement, setChargement] = useState(true)
  const [step, setStep] = useState('Authentification sécurisée')
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('black')
  const [back, setBack] = useState('white')
  const [plateform, setPlateform] = useState('')
  const [fin, setIsfin] = useState(false)

  const [ListPublications, setListPublications] = useState([]);


  const handleReceivedData = () => {
    console.log(ListPublications);
    console.log("*************");
    console.log(author.publications);
  };




  const getAuthorData = useCallback(async () => {
    try {
      setAuthor();
      setIsLoading(true);
      if (isError) setIsError(false);
      if (noResultFound) setNoResultFound(false);
      const response = await scraperService.getAuthorData(platform, authorId);
      if (response.data.author) {
        setAuthor(response.data.author);
        if (user) checkFollowAuthorization(response.data.author);
      }
      else if (response.data.error) setNoResultFound(true);
      else {
        // pushAlert({ message: "Incapable d'obtenir les données de l'auteur" });
        console.log("Incapable d'obtenir les données de l'auteur");
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [authorId]);

  const getIfIsFollowing = useCallback(async () => {
    try {
      const response = await userService.isFollowing(authorId);
      if (response.data.isFollowing) setIsFollowed(true);

      throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir si l'auteur est suivi" });
    }
  }, [authorId]);

  const findAllUsers = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      setUsers(response.data);
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir des utilisateurs" });
    }
  }, []);

  const toggleFollow = useCallback(
    async (user_id) => {
      try {
        const service = isFollowed
          ? userService.unfollowUser(authorId)
          : userService.followUser({ ...author, user_id });

        setsSendingFollow(true);
        await service;
        setIsFollowed(!isFollowed);
      } catch (error) {
        pushAlert({ message: "Incapable de basculer le suivi" });
      } finally {
        setsSendingFollow(false);
      }
    },
    [authorId, author]
  );

  const checkFollowAuthorization = useCallback(async (author) => {
    const trimName = (n) =>
      n.toLowerCase().replace(" ", "").replace(/[\s ,.]/gi, "");

    const possibleNames = [
      trimName(user.firstName) + trimName(user.lastName),
      trimName(user.lastName) + trimName(user.firstName),
    ];

    console.log("possibleNames");
    console.log(possibleNames);
    console.log("trimName(author.name)");
    // console.log(author.name);
    if (
      possibleNames.includes(trimName(author.name)) ||
      ["LABORATORY_HEAD", "TEAM_HEAD"].some((r) => user.roles.includes(r))
    ) {
      setIsAllowedToFollow(true);
      console.log("authorized");
    }
  }, []);

  // const ws = new WebSocket('ws://localhost:2000');
  const ws = new WebSocket('wss://rs-scraper-master.onrender.com/'); // Remplacez l'URL en conséquence

  const getAuthorDataa = useCallback(async () => {
    try {
      ws.onopen = () => {
        console.log('WebSocket connection opened');
        const auth = {
          authorId: authorId
        }
        ws.send(JSON.stringify(auth))
      };

      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        // setMessages((prevMessages) => [...prevMessages, receivedData]);
        console.log(receivedData);

        if (receivedData.author) {
          setAuthor(receivedData.author);
          setChargement(false)
          setServerError(false)
          if (user) checkFollowAuthorization(receivedData.author);
          setListPublications(receivedData.author.publications)
        }
        else if (receivedData.state) {
          console.log(receivedData.state);
          setServerError(true)
          setChargement(false)
        }
        else if (receivedData.res) {
          // setMessage(receivedData.res.message)
          setStep(receivedData.res.step)
          setPlateform(receivedData.res.plateforme)
          setColor(receivedData.res.color)
          setBack(receivedData.res.background)
        }
        else if (receivedData.fin) {
          console.log("fin de chargement des publications");
          setIsfin(true)
        }
        else {
          // pushAlert({ message: "Incapable d'obtenir les données de l'auteur" });
          setNoResultFound(true);
        }
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [authorId]);



  useEffect(() => {
    getAuthorDataa();
    if (!user) return;
    if (
      ["LABORATORY_HEAD", "TEAM_HEAD", "RESEARCHER"].some((r) =>
        user.roles.includes(r)
      )
    ) {
      getIfIsFollowing();
      findAllUsers();
    }
  }, []);


  return (
    <>
      <div className="row">

        {/* {noResultFound && <NoResultFound query={authorId} />} */}
        {serverError && <ErrorFound />}


        {author &&
          <Fragment>
            <div className="col-lg-8">
              <AuthorHeader
                platform={platform}
                users={users}
                user={user}
                author={author}
                toggleFollow={toggleFollow}
                isFollowed={isFollowed}
                isSendingFollow={isSendingFollow}
                isAllowedToFollow={isAllowedToFollow}
                showButton={fin}
              />


              <Publications
                platform={platform}
                author={author}
                setAuthor={setAuthor}
                isFin={fin}
                data={ListPublications}
              />
            </div>
            <div className="col-lg-4">
              <AuthorCitations author={author} />
              <Coauthors author={author} />
            </div>
          </Fragment>
        }
        {chargement &&

          <>
            <LoadingResult step={step} plateform={plateform} message={message} back={back} color={color} />
          </>
        }

      </div>
{/* {Listmessages &&
      <DataTableComponent
        data={Listmessages}
      />
} */}
      {/* <button onClick={handleReceivedData}>show data</button> */}

    </>
  );

};

export default Author;
