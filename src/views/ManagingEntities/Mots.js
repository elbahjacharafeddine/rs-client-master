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
import CRUDFormM from "../components/CRUDFormM";
import PageHeader from "../components/PageHeader";

const Mots = (props) => {
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { motService, laboratoryService } = ApiServices;

  const [mots, setMots] = useState([]);
  const [laboratories, setLaboratories] = useState([]);

  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Le mot", "Laboratoire"];

  const inputsSkeleton = [
    { name: "description", label: columns[0], type: "input" },
    {
      name: "laboratory",
      label: columns[1],
      type: "select",
      options: laboratories,
    },
  ];

  const clearInputs = () => {
    setInputs((inputs) => ({
      description: "",
      laboratory_id: "",
    }));
  };

  const updateMotData = useCallback(async () => {
    try {
      const response = await motService.findAllMots();
      if (response.data)
        setMots(
          response.data.map((mot) => ({
            ...mot,
            laboratory: mot.laboratory.name,
          }))
        );
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des mots",
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
    updateMotData();
    updateLaboratoriesData();
    clearInputs();
  }, [updateMotData, updateLaboratoriesData]);

  const editMot = (mot) => {
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...mot,
    }));
  };

  const addMot = async () => {
    try {
      const response = await motService.createMot(inputs);
      if (response.data) {
        updateMotData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer le mot" });
    }
  };

  const updateMot = async (mot) => {
    try {
      const response = await motService.updateMot({
        ...mot,
        ...inputs,
      });

      if (response.data) {
        setAction("ADDING");
        updateMotData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données du mot",
      });
    }
  };

  const deleteMot = async (mot) => {
    try {
      const response = await motService.deleteMot(
        mot._id
      );
      if (response.data) updateMotData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de supprimer le mot" });
    }
  };

  const handleSubmit = (event) => {
    if (inputs.laboratory_id === "")
      setInputs(() => ({
        ...inputs,
        laboratory_id: inputsSkeleton[1].options[0]._id,
      }));

    action === "ADDING"
      ? addMot()
      : action === "EDITING"
      ? updateMot()
      : updateMotData();

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
          title="Mot du directeur"
          subTitle={`${mots.length} mot(s)`}
        />
      </div>
      <div className="row row-cards row-deck">
        <div className="col-md-8">
          <CRUDTable
            columns={columns}
            data={mots}
            tableSkeleton={inputsSkeleton}
            actions={[
              {
                name: "Modifier",
                function: editMot,
                style: "primary",
              },
              {
                name: "Supprimer",
                function: deleteMot,
                style: "danger",
              },
            ]}
          />
        </div>
        <div className="col-md-4">
          <CRUDFormM
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

export default Mots;
