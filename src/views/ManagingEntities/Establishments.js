/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AppContext } from "../../context/AppContext";
import CRUDTable from "../components/CRUDTable";
import CRUDForm from "../components/CRUDForm";
import PageHeader from "../components/PageHeader";

const Establishments = (props) => {
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { establishmentService, universityService } = ApiServices;

  const [establishments, setEstablishments] = useState([]);
  const [universities, setUniversities] = useState([]);

  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Nom", "Abréviation", "Adresse", "Université"];

  const inputsSkeleton = [
    { name: "name", label: columns[0], type: "input" },
    { name: "abbreviation", label: columns[1], type: "input" },
    { name: "address", label: columns[2], type: "input" },
    {
      name: "university",
      label: columns[3],
      type: "select",
      options: universities,
    },
  ];

  const clearInputs = () => {
    setInputs((inputs) => ({
      name: "",
      abbreviation: "",
      address: "",
      university_id: "",
    }));
  };

  const updateEstablishmentData = useCallback(async () => {
    try {
      const response = await establishmentService.findAllEstablishments();
      if (response.data)
        setEstablishments(
          response.data.map((establishment) => ({
            ...establishment,
            university: establishment.university.name,
          }))
        );
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des établissements",
      });
    }
  }, []);

  const updateUniversitiesData = useCallback(async () => {
    try {
      const response = await universityService.findAllUniversities();
      if (response.data) setUniversities(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des universitaires",
      });
    }
  }, []);

  useEffect(() => {
    updateEstablishmentData();
    updateUniversitiesData();
    clearInputs();
  }, [updateEstablishmentData, updateUniversitiesData]);

  const editEstablishment = (establishment) => {
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...establishment,
    }));
  };

  const addEstablishment = async () => {
    try {
      const response = await establishmentService.createEstablishment(inputs);
      if (response.data) {
        updateEstablishmentData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer l'établissement" });
    }
  };

  const updateEstablishment = async (establishment) => {
    try {
      const response = await establishmentService.updateEstablishment({
        ...establishment,
        ...inputs,
      });

      if (response.data) {
        setAction("ADDING");
        updateEstablishmentData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données de l'établissement",
      });
    }
  };

  const deleteEstablishment = async (establishment) => {
    try {
      const response = await establishmentService.deleteEstablishment(
        establishment._id
      );
      if (response.data) updateEstablishmentData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de supprimer l'établissement" });
    }
  };

  const handleSubmit = (event) => {
    if (inputs.university_id === "")
      setInputs(() => ({
        ...inputs,
        university_id: inputsSkeleton[2].options[0]._id,
      }));

    action === "ADDING"
      ? addEstablishment()
      : action === "EDITING"
        ? updateEstablishment()
        : updateEstablishmentData();

    event.preventDefault();
  };

  const cancelEdit = (event) => {
    event.preventDefault();
    clearInputs();
    setAction("ADDING");
  };

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader
          title="Établissements"
          subTitle={`${establishments.length} établissement(s)`}
        />
      </div>
      <div className="row row-cards row-deck">
        <div className="col-md-8">
          <CRUDTable
            columns={columns}
            data={establishments}
            tableSkeleton={inputsSkeleton}
            actions={[
              {
                name: "Modifier",
                function: editEstablishment,
                style: "primary",
              },
              {
                name: "Supprimer",
                function: deleteEstablishment,
                style: "danger",
              },
            ]}
          />
        </div>
        <div className="col-md-4">
          <CRUDForm
            title="une nouvelle établissements"
            {...{
              inputs,
              setInputs,
              inputsSkeleton,
              handleSubmit,
              cancelEdit,
              action,
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Establishments;
