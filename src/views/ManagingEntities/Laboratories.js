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
import { useHistory } from "react-router-dom";

const Laboratories = () => {
  const history = useHistory();

  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { laboratoryService, establishmentService } = ApiServices;

  const [laboratories, setLaboratories] = useState([]);
  const [establishments, setEstablishments] = useState([]);

  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Nom", "Abréviation"];

  const inputsSkeleton = [
    { name: "name", label: columns[0], type: "input" },
    { name: "abbreviation", label: columns[1], type: "input" },
    {
      name: "establishment",
      label: columns[2],
      type: "select",
      options: establishments,
    },
  ];
  const inputsSkeleton2 = [
    { name: "name", label: columns[0], type: "input" },
    { name: "abbreviation", label: columns[1], type: "input" },

  ];

  const clearInputs = () => {
    setInputs((inputs) => ({
      name: "",
      abbreviation: "",
      establishment_id: "",
    }));
  };

  const updateLaboratoryData = useCallback(async () => {
    try {
      const response = await laboratoryService.findAllLaboratories();
      if (response.data)
        setLaboratories(
          response.data.map((laboratory) => ({
            ...laboratory,
            establishment: laboratory.establishment.name,
          }))
        );
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des laboratoires",
      });
    }
  }, []);

  const updateEstablishmentsData = useCallback(async () => {
    try {
      const response = await establishmentService.findAllEstablishments();
      if (response.data) setEstablishments(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des établissements",
      });
    }
  }, []);

  useEffect(() => {
    updateLaboratoryData();
    updateEstablishmentsData();
    clearInputs();
  }, [updateEstablishmentsData, updateLaboratoryData]);

  const editLaboratory = (laboratory) => {
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...laboratory,
    }));
  };

  const manageLaboratory = ({ _id }) => {
    history.push(`/laboratory/${_id}`);
  };

  const addLaboratory = async () => {
    try {
      const response = await laboratoryService.createLaboratory(inputs);
      if (response.data) {
        updateLaboratoryData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer le laboratoire" });
    }
  };

  const updateLaboratory = async (laboratory) => {
    try {
      const response = await laboratoryService.updateLaboratory({
        ...laboratory,
        ...inputs,
      });

      if (response.data) {
        setAction("ADDING");
        updateLaboratoryData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données de laboratoire",
      });
    }
  };

  const deleteLaboratory = async (laboratory) => {
    try {
      const response = await laboratoryService.deleteLaboratory(laboratory._id);
      if (response.data) updateLaboratoryData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de supprimer le laboratoire" });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    return action === "ADDING"
      ? addLaboratory()
      : action === "EDITING"
        ? updateLaboratory()
        : updateLaboratoryData();
  };

  const cancelEdit = () => {
    clearInputs();
    setAction("ADDING");
  };

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader
          title="Laboratoires"
          subTitle={`${laboratories.length} laboratoire(s)`}
        />
      </div>
      <div className="row row-cards row-deck">
        <div className="col-md-8">
          <CRUDTable
            columns={columns}
            data={laboratories}
            tableSkeleton={inputsSkeleton2}
            actions={[
              { name: "Gérer", function: manageLaboratory, style: "primary" },
              { name: "Modifier", function: editLaboratory, style: "primary" },
              {
                name: "Supprimer",
                function: deleteLaboratory,
                style: "danger",
              },
            ]}
          />
        </div>
        <div className="col-md-4">
          <CRUDForm
            title="un nouveau laboratoire"

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

export default Laboratories;
