/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AppContext } from "../../context/AppContext";
import CRUDForm from "../components/CRUDForm";
import PageHeader from "../components/PageHeader";
import { BookIcon, LocationIcon, EditingIcon } from "../components/icons";

const Universities = () => {
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { universityService } = ApiServices;
  const [universities, setUniversities] = useState([]);
  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Nom", "Abréviation", "Ville", "Pays"];
  const inputsSkeleton = [
    { name: "name", label: columns[0], type: "input" },
    { name: "abbreviation", label: columns[1], type: "input" },
    { name: "city", label: columns[2], type: "input" },
    { name: "country", label: columns[3], type: "input" },
  ];

  const clearInputs = () => {
    setInputs((inputs) => ({
      name: "",
      abbreviation: "",
      city: "",
      country: "",
    }));
  };

  const updateData = useCallback(async () => {
    try {
      const response = await universityService.findAllUniversities();
      if (response.data) setUniversities(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de l'université" });
    }
  }, []);

  useEffect(() => {
    updateData();
    clearInputs();
  }, []);

  const editUniversity = (university) => {
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...university,
    }));
  };

  const addUniversity = async () => {
    try {
      const response = await universityService.createUniversity(inputs);
      if (response.data) updateData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer l'université" });
    }
  };

  const updateUniversity = async (university) => {
    try {
      const response = await universityService.updateUniversity({
        ...university,
        ...inputs,
      });
      if (response.data) {
        setAction("ADDING");
        updateData();
        clearInputs();
      } else {
        throw Error();
      }
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données de l'université",
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    return action === "ADDING"
      ? addUniversity()
      : action === "EDITING"
      ? updateUniversity()
      : updateData();
  };

  const cancelEdit = () => {
    clearInputs();
    setAction("ADDING");
  };

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader title="Votre université" subTitle="" />
      </div>
      <div className="row row-cards row-deck">
        <div className="col-md-6">
          {universities.length === 0 && (
            <div className="text-muted text-center">
              les informations de votre université ne sont pas encore
              enregistrées
              <br /> Veuillez remplir le formulaire
            </div>
          )}
          {universities.length !== 0 && (
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  Informations de votre université{" "}
                </div>
                <div className="mb-2">
                  <BookIcon /> {universities[0].abbreviation} :{" "}
                  <strong>{universities[0].name}</strong>
                </div>
                <div className="mb-2">
                  <LocationIcon /> situé à :{" "}
                  <strong>
                    {" "}
                    {universities[0].city}, {universities[0].country}
                  </strong>
                </div>
                <div className="card-actions">
                  <a
                    href="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      editUniversity(universities[0]);
                    }}
                  >
                    <EditingIcon /> Modifier les informations de l'université
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-6">
          {(action === "EDITING" || universities.length === 0) && (
            <CRUDForm
              {...{
                inputs,
                setInputs,
                inputsSkeleton,
                handleSubmit,
                cancelEdit,
                action,
              }}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Universities;
