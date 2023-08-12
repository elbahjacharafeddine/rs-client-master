/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../components/Loader";
import swal from 'sweetalert';
import { IconButton, Typography } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import UpdateFormulaire from "./updateFormulaire";

const Publication = ({
  author,
  publication,
  updatePublication,
  index,
  getProfile,
  platform,
}) => {
  const { ApiServices,user, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService,userService } = ApiServices;

  const [noResultFound, setNoResultFound] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getJournalData = async () => {
    if (publication.searchedFor) return;



     

    var url="";
 if (publication.source=="Mobile Information Systems"){
      
      url="MOB-INF-SYST";
    }else if (publication.source=="Intelligent Automation and Soft Computing"){
      url="INTELL-AUTOM-SOFT-CO";
    }else if (publication.source=="Surfaces and Interfaces"){
      url="SURF-INTERFACE-ANAL";
    }else if (publication.source=="International Journal of Hydrogen Energy"){
      url="INT-J-HYDROGEN-ENERG";
    }else if (publication.source=="Sensors and Actuators, A: Physical"){
      url="SENSOR-ACTUAT-A-PHYS";
    }else if (publication.source=="Environmental Science and Pollution Research"){
      url="ENVIRON-SCI-POLLUT-R";
    }else if (publication.source=="International Journal of Energy Research"){
      url="INT-J-ENERG-RES";
    }else if (publication.source=="Computer Speech and Language"){
      url="COMPUT-SPEECH-LANG";
    }else if (publication.source=="Information Systems and e-Business Management"){
      url="INF-SYST-E-BUS-MANAG";
    }else if (publication.source=="European Journal of Control"){
      url="EUR-J-CONTROL";
    }else if (publication.source=="IMA Journal of Mathematical Control and Information"){
      url="IMA-J-MATH-CONTROL-I";
    }else if (publication.source=="Solid State Communications"){
      url="SOLID-STATE-COMMUN";
    }else if (publication.source=="Vacuum"){
      url="VACUUM";
    }else if (publication.source=="Journal of Magnetism and Magnetic Materials"){
      url="J-MAGN-MAGN-MATER";
    }else if (publication.source=="Journal of Superconductivity and Novel Magnetism"){
      url="J-SUPERCOND-NOV-MAGN";
    }else if (publication.source=="Journal of Electroceramics"){
      url="J-ELECTROCERAM";
    }else if (publication.source=="Chemical Physics Letters"){
      url="CHEM-PHYS-LETT";
    }else if (publication.source=="Scientific Reports"){
      url="SCI-REP-UK";
    }else if (publication.source=="Materials Letters"){
      url="MATER-LETT";
    }else if (publication.source=="Polymer Engineering and Science"){
      url="POLYM-ENG-SCI";
    }else if (publication.source=="EPJ Applied Physics"){
      url="EUR-PHYS-J-APPL-PHYS";
    }else if (publication.source=="Sensor Letters"){
      url="SENSOR-LETT";
    }else if (publication.source=="Molecular Crystals and Liquid Crystals"){
      url="MOL-CRYST-LIQ-CRYST";
    }else if (publication.source=="Computers and Mathematics with Applications"){
      url="COMPUT-MATH-APPL";
    }else if (publication.source=="Electronic Transactions on Numerical Analysis"){
      url="ELECTRON-T-NUMER-ANA";
    }else if (publication.source=="Advances in Applied Clifford Algebras"){
      url="ADV-APPL-CLIFFORD-AL";
    }else if (publication.source=="Journal of Chemical Thermodynamics"){
      url="J-CHEM-THERMODYN";
    }else if (publication.source=="Journal of Chemical and Engineering Data"){
      url="J-CHEM-ENG-DATA";
    }else if (publication.source=="Science of the Total Environment"){
      url="SCI-TOTAL-ENVIRON";
    }else if (publication.source=="Fuel"){
      url="FUEL";
    }else if (publication.source=="Fullerenes Nanotubes and Carbon Nanostructures"){
      url="FULLER-NANOTUB-CAR-N";
    }else if (publication.source=="Construction and Building Materials"){
      url="CONSTR-BUILD-MATER";
    }else if (publication.source=="Journal of Solid State Chemistry"){
      url="J-SOLID-STATE-CHEM";
    }else if (publication.source=="Journal of Thermal Analysis and Calorimetry"){
      url="J-THERM-ANAL-CALORIM";
    }else if (publication.source=="Journal of Analytical Methods in Chemistry"){
      url="J-ANAL-METHODS-CHEM";
    }else if (publication.source=="Ceramics International"){
      url="CERAM-INT";
    }else if (publication.source=="Journal of Hazardous Materials"){
      url="J-HAZARD-MATER";
    }else if (publication.source=="Environmental Technology"){
      url="ENVIRON-TECHNOL";
    }else if (publication.source=="Acta Crystallographica Section E: Structure Reports Online"){
      url="ACTA-CRYSTALLOGR-E";
    }else if (publication.source=="Nonlinear Analysis: Modelling and Control"){
      url="NONLINEAR-ANAL-MODEL";
    }else if (publication.source=="Electronic Journal of Differential Equations"){
      url="ELECTRON-J-DIFFER-EQ";
    }else if (publication.source=="Mathematical Modelling of Natural Phenomena"){
      url="MATH-MODEL-NAT-PHENO";
    }else if (publication.source=="International Journal on Semantic Web and Information Systems"){
      url="INT-J-SEMANT-WEB-INF";
    }else if (publication.source=="Expert Systems with Applications"){
      url="EXPERT-SYST-APPL";
    }else if (publication.source=="International Journal of Thermal Sciences"){
      url=" INT-J-THERM-SCI";
    }else if (publication.source=="Journal of Materials Engineering and Performance"){
      url="J-MATER-ENG-PERFORM";
    }else if (publication.source=="Journal of Materials Research"){
      url="J-MATER-RES";
    }else if (publication.source=="Multimedia Tools and Applications"){
      url="MULTIMED-TOOLS-APPL";
    }else if (publication.source=="Physica Scripta"){
      url="PHYS-SCRIPTA";
    }else if (publication.source=="Journal of Building Physics"){
      url="J-BUILD-PHYS";
    }else if (publication.source=="Journal of Composite Materials"){
      url="J-COMPOS-MATER";
    }else if (publication.source=="European Physical Journal Plus"){
      url="EUR-PHYS-J-PLUS";
    }else if (publication.source=="Polymers for Advanced Technologies"){
      url="POLYM-ADVAN-TECHNOL";
    }else if (publication.source=="Computer Speech & Language"){
      url="COMPUT-SPEECH-LANG";
    }else if (publication.source=="International Journal of Industrial Engineering : Theory Applications"){
      url="INT-J-IND-ENG-THEORY";
    }else if (publication.source=="Marine and Petroleum Geology"){
      url="MAR-PETROL-GEOL";
    }else if (publication.source=="Tectonophysics"){
      url="TECTONOPHYSICS";
    }else if (publication.source=="Tectonics"){
      url="TECTONICS";
    }else if (publication.source=="Bulletin de la Societe Geologique de France"){
      url="B-SOC-GEOL-FR";
    }else if (publication.source=="International Journal of Sediment Research"){
      url="INT-J-SEDIMENT-RES";
    }else if (publication.source=="Frequenz"){
      url="FREQUENZ";
    }else if (publication.source=="Journal of Materials Science: Materials in Electronics"){
      url="J-MATER-SCI-MATER-EL";
    }else if (publication.source=="Environmental Science and Pollution Research"){
      url="ENVIRON-SCI-POLLUT-R";
    }else if (publication.source=="Thermochimica Acta"){
      url="THERMOCHIM-ACTA";
    }else if (publication.source=="Numerical Algorithms"){
      url="NUMER-ALGORITHMS";
    }else if (publication.source=="KSCE Journal of Civil Engineering"){
      url="KSCE-J-CIV-ENG";
    }else if (publication.source=="Polymers for Advanced Technologies"){
      url="POLYM-ADVAN-TECHNOL";
    }else if (publication.source=="Computer Systems Science and Engineering"){
      url="COMPUT-SYST-SCI-ENG";
    }else if (publication.source=="Journal of Information Science and Engineering"){
      url="J-INF-SCI-ENG";
    }else if (publication.source=="Sensors and Actuators, A: Physical"){
      url="SENSOR-ACTUAT-A-PHYS";
    }else if (publication.source=="Journal of Combinatorial Optimization"){
      url="J-COMB-OPTIM";
    }else if (publication.source=="International Journal of Green Energy"){
      url="INT-J-GREEN-ENERGY";
    }else if (publication.source=="Optical and Quantum Electronics"){
      url="OPT-QUANT-ELECTRON";
    }else if (publication.source=="Journal of Plasma Physics"){
      url="J-PLASMA-PHYS";
    }else if (publication.source=="Chinese Journal of Physics"){
      url="CHINESE-J-PHYS";
    }else if (publication.source=="International Journal of Environmental Analytical Chemistry"){
      url="INT-J-ENVIRON-AN-CH";
    }else if (publication.source=="Ecological Engineering"){
      url="ECOL-ENG";
    }else if (publication.source=="Electroanalysis"){
      url="ELECTROANAL";
    }else if (publication.source=="Desalination and Water Treatment"){
      url="DESALIN-WATER-TREAT";
    }else if (publication.source=="Journal of Molecular Liquids"){
      url="J-MOL-LIQ";
    }else if (publication.source=="Fluid Phase Equilibria"){
      url="FLUID-PHASE-EQUILIBR";
    }else if (publication.source=="Journal of Electrical Engineering and Technology"){
      url="J-ELECTR-ENG-TECHNOL";
    }else if (publication.source=="Sustainability (Switzerland)"){
      url="SUSTAINABILITY-BASEL";
    }else if (publication.source=="Optik"){
      url="OPTIK";
    }else if (publication.source=="Energies"){
      url="ENERGIES";
    }else if (publication.source=="Electric Power Systems Research"){
      url="ELECTR-POW-SYST-RES";
    }else if (publication.source=="IEEE Transactions on Industrial Electronics"){
      url="IEEE-T-IND-ELECTRON";
    }else if (publication.source=="International Journal of Biological Macromolecules"){
      url="INT-J-BIOL-MACROMOL";
    }else if (publication.source=="Journal of Advanced Transportation"){
      url="J-ADV-TRANSPORT";
    }else if (publication.source=="Water, Air, and Soil Pollution"){
      url="WATER-AIR-SOIL-POLL";
    }else{url=""}

    console.log(publication.source)
    console.log(url)




    

    const journalName = publication.source
      ? publication.source
      : publication.extraInformation && publication.extraInformation["Journal"]
      ? publication.extraInformation["Journal"]
      : null;

    if (!journalName || !publication.year || publication.year.trim() === "") {
      console.log("No data");
      updatePublication(index, {
        ...publication,
        searchedFor: true,
      });
      return;
    }
    setIsLoading(true);

    try {
      console.log("jouranlName : ", journalName);

      const journalNameQuery = journalName.replace("/", "").replace("\\", "");

      const response = await scraperService.getJournalData(
        journalNameQuery,
        publication.year
      );
      
      
      if (response.data.error || response.data.status === 404) {
        setNoResultFound(true);
        updatePublication(index, {
          ...publication,
          searchedFor: true,
        });
      } else {
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          IF: response.data.journal["IF"],
          SJR: response.data.journal["SJR"],
          searchedFor: true,
        });
        
        const userP=user._id;
       const responseDB=userService.addSJR({
          id:userP,
          title:publication.title,
          IF: response.data.journal["IF"],
          SJR: response.data.journal["SJR"],
        })
      };
     
      
    }catch (e) {
      updatePublication(index, {
        ...publication,
        searchedFor: true,
      });
      pushAlert({
        message:
          "Incapable d'obtenir les données de la publication" +
          publication.title,
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    if (!publication.IF && !publication.SJR && !publication.searchedFor)
      setTimeout(() => {
        if (isMounted) getJournalData();
      }, index * 2000 + 2000);

    return () => {
      isMounted = false;
    };
  }, []);
  const [modalShow, setModalShow] = useState(false);
  const showModal = (props) => {
    setModalShow(true);
  }
  const hideModal = () => {
    setModalShow(false);
  }
  const [pub, setPub] = useState({
    _id:publication._id,
    auteur: publication.authors.join("; "),
    titre: publication.title,
    annee: publication.year,
    citation: publication.citation ? publication.citation.replace("*", "") : "",
    source: publication.source,
    IF: publication.IF ?? " ",
    SJR: publication.SJR ?? " ",
  });
  const clearInputs = () => {
    setPub({
      auteur: "",
      titre: "",
      annee: "",
      citation: "",
      source: "",
      IF: "",
      SJR: "",
    });
  };

  const deletePub = async (e) =>{
    var idPub=e.currentTarget.id;
    console.log(user._id);
    console.log(idPub)
    swal({
      title: "Confirmation",
      text: "Etes vous sur de vouloir supprimer cette publication ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willAdd) => {
      if (willAdd) {
        const userP=user._id;
        
        try {
          const response =  userService.deletePub({
            idAuthor:user._id,
            idPub:idPub, 
            
          });
          getProfile();
          swal("La publication est supprimée", {
            icon: "success",
          });
    
          if (response.data) {
            pushAlert({
              type: "success",
              message: "Le mot de passe a été mis à jour",
            });
           
          } else throw Error();
        } catch (e) {
          pushAlert({
            message: "Incapable de mettre à jour la photo de profil",
          });
        }
       
      } else {
        swal("l'operation est annulée");
      }
    });
    
  }

  const updatePub = () => {

    swal({
      title: "Confirmation",
      text: "Etes vous sur de vouloir modifier cette publication ?",
      icon: "warning",
      buttons: true,
    })
      .then(async (willAdd) => {
        if (willAdd) {
          const userP = user._id;

          try {
            const response = userService.updatePub({
              idAuthor: userP,
              id_: publication._id,
              authors: pub.auteur.split(";"),
              title: pub.titre,
              citation: pub.citation,
              year: pub.annee,
              source: pub.source,
              IF: pub.IF,
              SJR: pub.SJR



            });
            console.log(userP+publication._id+pub.titre)
            getProfile();
            swal("La publication est modifiée", {
              icon: "success",
            });
            hideModal();
            if (response.data) {
              pushAlert({
                type: "success",
                message: "Le mot de passe a été mis à jour",
              });

            } else throw Error();
          } catch (e) {
            pushAlert({
              message: "Incapable de mettre à jour la photo de profil",
            });
          }

        } else {
          swal("l'operation est annulée");

        }
      });
  };


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
        {!isFetched && !publication.searchedFor && !isLoading && fetchedButton}
      </td>
      <td>
          <IconButton id={publication._id}
            size="small" color="primary" component="span"
            onClick={showModal}>
            <UpdateIcon />
          </IconButton>
      </td>
      <td>

      <IconButton id={publication._id}
     size="small" color="secondary" component="span"
      onClick= {deletePub}>
        <DeleteIcon />
        </IconButton>
      </td>
    </tr>
     <UpdateFormulaire show={modalShow} hideModal={hideModal} pub={pub}
     setPub={setPub}  clearInputs={clearInputs} updatePub={updatePub}
   />
   </>
  );
};

export default Publication;
