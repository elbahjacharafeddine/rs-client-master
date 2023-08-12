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
  import CRUDFormP from "../components/CRUDFormP";
  import PageHeader from "../components/PageHeader";
  
  const Projets = (props) => {
    const { ApiServices, alertService } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { projetsService, laboratoryService } = ApiServices;
  
    const [projets, setProjets] = useState([]);
    const [laboratories, setLaboratories] = useState([]);
  
    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");
  
    const columns = ["Titre", "Déscription", "Laboratoire"];
  
    const inputsSkeleton = [
      { name: "title", label: columns[0], type: "input" },
      { name: "description", label: columns[1], type: "input" },
      {
        name: "laboratory",
        label: columns[2],
        type: "select",
        options: laboratories,
      },
    ];
  
    const clearInputs = () => {
      setInputs((inputs) => ({
        title: "",
        description: "",
        laboratory_id: "",
      }));
    };
  
    const updateProjetData = useCallback(async () => {
      try {
        const response = await projetsService.findAllProjets();
        if (response.data)
          setProjets(
            response.data.map((projet) => ({
              ...projet,
              laboratory: projet.laboratory.name,
            }))
          );
        else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable d'obtenir les données des projets",
        });
      }
    }, []);
  
    const updateLaboratoriesData = useCallback(async () => {
      try {
        const response = await laboratoryService.findAllLaboratories();
        if (response.data) setLaboratories(response.data);
        else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable d'obtenir les données des laboratoires",
        });
      }
    }, []);
  
    useEffect(() => {
      updateProjetData();
      updateLaboratoriesData();
      clearInputs();
    }, [updateProjetData, updateLaboratoriesData]);
  
    const editProjet = (projet) => {
      setAction("EDITING");
      setInputs((inputs) => ({
        ...inputs,
        ...projet,
      }));
    };
  
    const addProjet = async () => {
      try {
        const response = await projetsService.createProjet(inputs);
        if (response.data) {
          updateProjetData();
          clearInputs();
        } else throw Error();
      } catch (error) {
        pushAlert({ message: "Incapable de créer le projet" });
      }
    };
  
    const updateProjet = async (projet) => {
      try {
        const response = await projetsService.updateProjet({
          ...projet,
          ...inputs,
        });
  
        if (response.data) {
          setAction("ADDING");
          updateProjetData();
          clearInputs();
        } else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable de mettre à jour les données du projet",
        });
      }
    };
  
    const deleteProjet = async (projet) => {
      try {
        const response = await projetsService.deleteProjet(
            projet._id
        );
        if (response.data) updateProjetData();
        else throw Error();
      } catch (error) {
        pushAlert({ message: "Incapable de supprimer le projet" });
      }
    };
  
    const handleSubmit = (event) => {
      if (inputs.laboratory_id === "")
        setInputs(() => ({
          ...inputs,
          laboratory_id: inputsSkeleton[2].options[0]._id,
        }));
  
      action === "ADDING"
        ? addProjet()
        : action === "EDITING"
        ? updateProjet()
        : updateProjetData();
  
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
            title="Projets"
            subTitle={`${projets.length} projet(s)`}
          />
        </div>
        <div className="row row-cards row-deck">
          <div className="col-md-8">
            <CRUDTable
              columns={columns}
              data={projets}
              tableSkeleton={inputsSkeleton}
              actions={[
                {
                  name: "Modifier",
                  function: editProjet,
                  style: "primary",
                },
                {
                  name: "Supprimer",
                  function: deleteProjet,
                  style: "danger",
                },
              ]}
            />
          </div>
          <div className="col-md-4">
            <CRUDFormP
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
  
  export default Projets;
  