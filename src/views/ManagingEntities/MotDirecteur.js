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
  import swal from 'sweetalert';
  
  const Mots = () => {
    const history = useHistory();
    const { user, ApiServices, UserHelper, alertService } = useContext(
      AppContext
    );
    const { pushAlert } = alertService;
    const { motService } = ApiServices;
  
    const [mots, setMots] = useState([]);
    const [laboratories, setLaboratories] = useState([]);
  
    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");
  
    const columns = ["mot"];
  
    //const inputsSkeleton = [
      //{ name: "name", label: columns[0], type: "input" },
      //{ name: "abbreviation", label: columns[1], type: "input" },
      //{
      //  name: "laboratory",
      //  label: columns[2],
       // type: "select",
       // options: laboratories,
      //},
   // ];
    const inputsSkeleton2 = [
      { name: "mot", label: columns[0], type: "input" },
    ];
  
    const clearInputs = () => {
      setInputs(() => ({
        mot: "",
        laboratory_id: "",
      }));
    };
  
    const updateMotData = useCallback(async () => {
      try {
        const response = await motService.findAllMots();
        if (response.data) {
          const filteredLaboratoiresIds = user.laboratoriesHeaded.map(
            ({ _id }) => _id
          );
          const filteredMots = response.data
            .filter(
              (mot) => filteredLaboratoiresIds.indexOf(mot.laboratory_id) !== -1
            )
            .map((mot) => ({
              ...mot,
              laboratory: mot.laboratory.name,
            }));
          setMots(filteredMots);
  
  
        } else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable de mettre à jour les mots",
        });
      }
    }, [user.laboratoriesHeaded]);
  
    const updateLaboratoriesData = useCallback(() => {
      setLaboratories(user.laboratoriesHeaded);
    }, [user.laboratoriesHeaded]);
  
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
        pushAlert({ message: "Incapable d'ajouter le mot du directeur'" });
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
  
        swal({
          title: "Confirmation",
          text: "Etes vous sur de vouloir supprimer le mot ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then(async (willDelete) => {
            if (willDelete) {
              const response = await motService.deleteMot(mot._id);
              if (response.data) updateMotData();
              else throw Error();
              if (mot.head_id === user._id) {
                pushAlert({
                  type: "success",
                  message:
                    "vous êtes chef de l'équipe que vous venez de supprimer. Vous serez déconnecté pour rétablir vos rôles",
                });
                setTimeout(() => {
                  history.push("/login");
                }, 1500);
              }
              swal("Le mot est supprimé avec succès", {
                icon: "success",
              });
            } else {
              swal("Abortion du transaction!");
            }
          });
      } catch (error) {
        pushAlert({ message: "Incapable de supprimer le mot" });
      }
    };
  
    //const manageTeam = ({ _id }) => {
    //  history.push(`/team/${_id}`);
    //};
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      return action === "ADDING"
        ? addMot()
        : action === "EDITING"
          ? updateMot()
          : updateMotData();
    };
  
    const cancelEdit = () => {
      clearInputs();
      setAction("ADDING");
    };
  
    useEffect(() => {
      updateMotData();
      updateLaboratoriesData();
      clearInputs();
    }, []);
  
  
    return (
      <Fragment>
        <div className="page-header">
          <PageHeader
            title={`Mot du directeur ${UserHelper.userHeadedLaboratories(
              user
            )}`}
            //subTitle={`${teams.length} équipe(s)`}
          />
        </div>
        <div className="row row-cards row-deck">
          <div className="col-md-8">
            <CRUDTable
              columns={columns}
              data={mots}
              tableSkeleton={inputsSkeleton2}
              actions={[
                //{ name: "Gérer", function: manageTeam, style: "primary" },
                { name: "Modifier", function: editMot, style: "primary" },
                {
                  name: "Supprimer",
                  function: deleteMot,
                  style: "danger",
                },
              ]}
            />
          </div>
         
        </div>
      </Fragment>
    );
  };
  
  export default Mots;
  