import React, { useContext, useState, useCallback, useEffect } from "react";

import image1 from "../../assets/images/illustrations/undraw_people_search.svg";
import image2 from "../../assets/images/illustrations/undraw_hire_te5y.svg";
import { Link } from "react-router-dom";
import { LoopIcon, SettingsIcon } from "../components/icons";
import { AppContext } from "../../context/AppContext";
import { Bar, Chart } from 'react-chartjs-2';
import Icon from '@mdi/react';
import { mdiAccountClock, mdiAccountGroupOutline, mdiAccountMultipleMinus, mdiAccountGroup, mdiNoteMultiple } from '@mdi/js';

const HomePage = () => {
  Chart.defaults.global.legend.labels.usePointStyle = true;

  const { user, UserHelper } = useContext(AppContext);
  const { ApiServices } = useContext(AppContext);
  const { userService, phdStudentService } = ApiServices;

  const [researchers, setReaserchers] = useState([]);
  const [doctorants, setDoctorants] = useState([]);
  const [state, setState] = useState({});
  const [classement, setClassement] = useState({});
  const [pubs, setPubs] = useState();
  const [doctorantsSoutenus, setDoctorantsSoutenus] = useState(0);
  const [doctorantTotal, setDoctorantsTotal] = useState(0);

  const updateStats = useCallback(async () => {
    const connectedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const responseAllPHD = await phdStudentService.findAllPhdStudents();
      setDoctorantsTotal(responseAllPHD.data.length)
      const respDoc = await phdStudentService.findPhdStudentOfLab();
      if (respDoc.data) {
        var filtredDoc = new Array();
        var docSoutenus = new Array();
        respDoc.data.students.forEach((doc) => {
          if (parseInt(doc.end.split('-')[0]) > new Date().getFullYear()) {
            filtredDoc.push(doc)
          } else if (parseInt(doc.end.split('-')[0]) == new Date().getFullYear() && parseInt(doc.end.split('-')[1]) >= new Date().getMonth() + 1) {
            filtredDoc.push(doc)
          } else {
            docSoutenus.push(doc)
          }
        })
        setDoctorants(filtredDoc)
        setDoctorantsSoutenus(docSoutenus)
      } else throw Error();
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await userService.getFollowedUsers({ "laboratory_abbreviation": connectedUser.laboratoriesHeaded[0].abbreviation });
      if (response.data) {
        setReaserchers(
          response.data
        );
        var count = 0;
        response.data.forEach((e) => {
          count += e.publications.length;
        })
        var pubData = new Map();
        var nom = new Array();
        var nombre = new Array();
        response.data.forEach((data) => {
          nom.push(data.name);
          nombre.push(data.publications.length)
          data.publications.forEach((pub) => {
            pubData.set(pub.year, 0)
          })
        })

        var occ = new Set();
        response.data.forEach((data) => {
          data.publications.forEach((pub) => {
            if (!occ.has(pub.title.toLowerCase())) {
              occ.add(pub.title.toLowerCase());
              pubData.set(pub.year, pubData.get(pub.year) + 1)
            }
          })
        })

        setPubs(occ.size)

        var keys = Array.from(pubData.keys()).sort();
        var data = new Array();
        keys.forEach((key) => {
          data.push(pubData.get(key));
        })
        setState({
          labels: keys,
          datasets: [
            {
              label: 'publications',
              backgroundColor: '#0275d8',
              data: data
            }
          ]
        })
        setClassement({
          labels: nom,
          datasets: [
            {
              label: 'publications',
              backgroundColor: '#5cb85c',
              data: nombre
            }
          ]
        })
      }
      else throw Error();
    } catch (error) {
      console.log(error)
    }


  }, []);



  useEffect(() => {
    updateStats();
  }, [updateStats]);


  return (
    <div class="container">
      {user.roles.includes("LABORATORY_HEAD") ? <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-row">
                <div class="col-3 align-self-center">
                  <div class="round ">
                    <Icon path={mdiAccountGroup}
                      size={2}
                      color="#5cb85c" />
                  </div>
                </div>
                <div class="col-9 align-self-center text-right">
                  <div class="m-l-10">
                    <h5 class="mt-0">{researchers.length}</h5>
                    <p class="mb-0 text-muted">Chercheurs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user.roles.includes("RESEARCH_DIRECTOR") &&
          <div class="col">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-row">
                  <div class="col-3 align-self-center">
                    <div class="round ">
                      <Icon path={mdiAccountGroupOutline}
                        size={2}
                        color="#292b2c" />
                    </div>
                  </div>
                  <div class="col-9 align-self-center text-right">
                    <div class="m-l-10">
                      <h5 class="mt-0">{doctorantTotal}</h5>
                      <p class="mb-0 text-muted">Doctorants</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-row">
                <div class="col-3 align-self-center">
                  <div class="round ">
                    <Icon path={mdiAccountMultipleMinus}
                      size={2}
                      color="#1e90ff" />
                  </div>
                </div>
                <div class="col-9 align-self-center text-right">
                  <div class="m-l-10">
                    <h5 class="mt-0">{doctorantsSoutenus.length}</h5>
                    <p class="mb-0 text-muted">Doctorants soutenus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-row">
                <div class="col-3 align-self-center">
                  <div class="round ">
                    <Icon path={mdiAccountClock}
                      size={2}
                      color="#f0ad4e" />
                  </div>
                </div>
                <div class="col-9 text-right align-self-center">
                  <div class="m-l-10 ">
                    <h5 class="mt-0">{doctorants.length}</h5>
                    <p class="mb-0 text-muted">Doctorants en cours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-row">
                <div class="col-3 align-self-center">
                  <div class="round ">
                    <Icon path={mdiNoteMultiple}
                      size={2}
                      color="#d9534f" />
                  </div>
                </div>
                <div class="col-9 text-right align-self-center">
                  <div class="m-l-10 ">
                    <h5 class="mt-0">{pubs}</h5>
                    <p class="mb-0 text-muted">Publications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : ""}

      <div className="row">
        {!user.roles.includes("LABORATORY_HEAD") && (
          <div
            className={`empty  text-center ${user.roles.includes("TEAM_HEAD") ? "col-md-6" : "col-md-12"
              }`}
          >
            <div className="empty-icon">
              <img src={image1} className="h-8 mb-4" alt="" />
            </div>
            <p className="empty-title h3">Bienvenue sur la page d'accueil </p>
            <p className="empty-subtitle text-muted">
              Essayez d'utiliser la barre de recherche pour trouver l'auteur que
              vous recherchez.</p>
            <div className="empty-action">
              <button
                onClick={() => {
                  document.getElementById("author-search-input").focus();
                }}
                className="btn btn-primary"
              >
                <LoopIcon />Rechercher un auteur</button>
            </div>
          </div>
        )}


        {user.roles.includes("TEAM_HEAD") && !user.roles.includes("LABORATORY_HEAD") && (
          <div className="empty col-md-6">
            <div className="empty-icon">
              <img src={image2} className="h-8 mb-4" alt="" />
            </div>
            <p className="empty-title h3">
              Étant que {UserHelper.userShortBio(user)}
            </p>
            <p className="empty-subtitle text-muted">
              Vous pouvez gérer votre équipe
          </p>
            {user.teamsHeaded.map(({ abbreviation, _id }) => (
              <div className="empty-action">
                <Link to={`/team/${_id}`} className="btn btn-primary">
                  <SettingsIcon />
                Gérer votre équipe {abbreviation}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {user.roles.includes("LABORATORY_HEAD") && (
        <div class="row">
          <div class="col-sm-12" >
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-row">
                  <Bar
                    data={state}
                    height={100}
                    options={{
                      title: {
                        display: true,
                        text: 'Nombre des publications par année',
                      },
                      legend: {
                        display: true,
                        position: 'top'
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12" >
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-row">
                  <Bar
                    data={classement}
                    height={100}
                    options={{
                      title: {
                        display: true,
                        text: 'Classement des chercheurs (nombre de publications)',
                      },
                      legend: {
                        display: true,
                        position: 'top'
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>


        </div>)}
    </div>
  );
};

export default HomePage;
