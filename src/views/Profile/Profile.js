/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  Fragment,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Publications from "../Author/components/Publications";
import AuthorCitations from "../Author/components/AuthorCitations";
import Coauthors from "../Author/components/Coauthors";
import ProfileHeader from "./components/ProfileHeader";
import PublicationsAuth from "../Author/components/PublicationsAuth";

const Profile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [correspondingFollowedUser, setCorrespondingFollowedUser] = useState(
    null
  );
  const [correspondingFollowedUserCitation, setCorrespondingFollowedUserCitation] = useState(
    null
  );
  const { ApiServices,user, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService,scraperService } = ApiServices;
  useEffect(() => {
    getProfile();
    updateCitation();
  }, [id]);

  const getProfile = useCallback(async () => {
    try {
     
      const response = await userService.findUser(id);
      if (response.data) {
        setProfileUser(response.data);
        setCorrespondingFollowedUser(response.data.correspondingFollowedUser);
        setCorrespondingFollowedUserCitation(response.data.correspondingFollowedUser);   
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de profil" });
    }
  }, [id]);

  const updateCitation = useCallback(async () => {
    try {
      const response = await userService.findUser(id);
      const journalName = response.data.correspondingFollowedUser.publications[6].source
      ? response.data.correspondingFollowedUser.publications[0].source
      : response.data.correspondingFollowedUser.publications[0].extraInformation && response.data.correspondingFollowedUser.publications[0].extraInformation["Journal"]
      ? response.data.correspondingFollowedUser.publications[0].extraInformation["Journal"]
      : null;

      const journalNameQuery = journalName.replace("/", "").replace("\\", "");

      const response1 = await scraperService.getJournalData(
        journalNameQuery,
        "2019"
      );
      console.log(response1)


      var url="";
      const responseScrap = await scraperService.getAuthorData(response.data.correspondingFollowedUser.platform, response.data.correspondingFollowedUser.authorId);
      for(var i=0;i<response.data.correspondingFollowedUser.publications.length;i++){
        if (response.data.correspondingFollowedUser.publications[i].IF=!undefined  && !(response.data.correspondingFollowedUser.publications[i].IF==null)){
          url="";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Mobile Information Systems"){
          console.log("hhhheeeheehhhehehehehloo"+response.data.correspondingFollowedUser.publications[i].IF)
          url="MOB-INF-SYST";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Intelligent Automation and Soft Computing"){
          url="INTELL-AUTOM-SOFT-CO";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Surfaces and Interfaces"){
          url="SURF-INTERFACE-ANAL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Hydrogen Energy"){
          url="INT-J-HYDROGEN-ENERG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Sensors and Actuators, A: Physical"){
          url="SENSOR-ACTUAT-A-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Environmental Science and Pollution Research"){
          url="ENVIRON-SCI-POLLUT-R";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Energy Research"){
          url="INT-J-ENERG-RES";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Computer Speech and Language"){
          url="COMPUT-SPEECH-LANG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Information Systems and e-Business Management"){
          url="INF-SYST-E-BUS-MANAG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="European Journal of Control"){
          url="EUR-J-CONTROL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="IMA Journal of Mathematical Control and Information"){
          url="IMA-J-MATH-CONTROL-I";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Solid State Communications"){
          url="SOLID-STATE-COMMUN";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Vacuum"){
          url="VACUUM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Magnetism and Magnetic Materials"){
          url="J-MAGN-MAGN-MATER";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Superconductivity and Novel Magnetism"){
          url="J-SUPERCOND-NOV-MAGN";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Electroceramics"){
          url="J-ELECTROCERAM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Chemical Physics Letters"){
          url="CHEM-PHYS-LETT";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Scientific Reports"){
          url="SCI-REP-UK";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Materials Letters"){
          url="MATER-LETT";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Polymer Engineering and Science"){
          url="POLYM-ENG-SCI";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="EPJ Applied Physics"){
          url="EUR-PHYS-J-APPL-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Sensor Letters"){
          url="SENSOR-LETT";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Molecular Crystals and Liquid Crystals"){
          url="MOL-CRYST-LIQ-CRYST";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Computers and Mathematics with Applications"){
          url="COMPUT-MATH-APPL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Electronic Transactions on Numerical Analysis"){
          url="ELECTRON-T-NUMER-ANA";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Advances in Applied Clifford Algebras"){
          url="ADV-APPL-CLIFFORD-AL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Chemical Thermodynamics"){
          url="J-CHEM-THERMODYN";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Chemical and Engineering Data"){
          url="J-CHEM-ENG-DATA";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Science of the Total Environment"){
          url="SCI-TOTAL-ENVIRON";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Fuel"){
          url="FUEL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Fullerenes Nanotubes and Carbon Nanostructures"){
          url="FULLER-NANOTUB-CAR-N";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Construction and Building Materials"){
          url="CONSTR-BUILD-MATER";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Solid State Chemistry"){
          url="J-SOLID-STATE-CHEM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Thermal Analysis and Calorimetry"){
          url="J-THERM-ANAL-CALORIM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Analytical Methods in Chemistry"){
          url="J-ANAL-METHODS-CHEM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Ceramics International"){
          url="CERAM-INT";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Hazardous Materials"){
          url="J-HAZARD-MATER";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Environmental Technology"){
          url="ENVIRON-TECHNOL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Acta Crystallographica Section E: Structure Reports Online"){
          url="ACTA-CRYSTALLOGR-E";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Nonlinear Analysis: Modelling and Control"){
          url="NONLINEAR-ANAL-MODEL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Electronic Journal of Differential Equations"){
          url="ELECTRON-J-DIFFER-EQ";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Mathematical Modelling of Natural Phenomena"){
          url="MATH-MODEL-NAT-PHENO";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal on Semantic Web and Information Systems"){
          url="INT-J-SEMANT-WEB-INF";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Expert Systems with Applications"){
          url="EXPERT-SYST-APPL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Thermal Sciences"){
          url=" INT-J-THERM-SCI";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Materials Engineering and Performance"){
          url="J-MATER-ENG-PERFORM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Materials Research"){
          url="J-MATER-RES";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Multimedia Tools and Applications"){
          url="MULTIMED-TOOLS-APPL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Physica Scripta"){
          url="PHYS-SCRIPTA";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Building Physics"){
          url="J-BUILD-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Composite Materials"){
          url="J-COMPOS-MATER";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="European Physical Journal Plus"){
          url="EUR-PHYS-J-PLUS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Polymers for Advanced Technologies"){
          url="POLYM-ADVAN-TECHNOL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Computer Speech & Language"){
          url="COMPUT-SPEECH-LANG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Industrial Engineering : Theory Applications"){
          url="INT-J-IND-ENG-THEORY";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Marine and Petroleum Geology"){
          url="MAR-PETROL-GEOL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Tectonophysics"){
          url="TECTONOPHYSICS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Tectonics"){
          url="TECTONICS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Bulletin de la Societe Geologique de France"){
          url="B-SOC-GEOL-FR";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Sediment Research"){
          url="INT-J-SEDIMENT-RES";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Frequenz"){
          url="FREQUENZ";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Materials Science: Materials in Electronics"){
          url="J-MATER-SCI-MATER-EL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Environmental Science and Pollution Research"){
          url="ENVIRON-SCI-POLLUT-R";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Thermochimica Acta"){
          url="THERMOCHIM-ACTA";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Numerical Algorithms"){
          url="NUMER-ALGORITHMS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="KSCE Journal of Civil Engineering"){
          url="KSCE-J-CIV-ENG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Polymers for Advanced Technologies"){
          url="POLYM-ADVAN-TECHNOL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Computer Systems Science and Engineering"){
          url="COMPUT-SYST-SCI-ENG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Information Science and Engineering"){
          url="J-INF-SCI-ENG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Sensors and Actuators, A: Physical"){
          url="SENSOR-ACTUAT-A-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Combinatorial Optimization"){
          url="J-COMB-OPTIM";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Green Energy"){
          url="INT-J-GREEN-ENERGY";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Optical and Quantum Electronics"){
          url="OPT-QUANT-ELECTRON";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Plasma Physics"){
          url="J-PLASMA-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Chinese Journal of Physics"){
          url="CHINESE-J-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Environmental Analytical Chemistry"){
          url="INT-J-ENVIRON-AN-CH";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Ecological Engineering"){
          url="ECOL-ENG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Electroanalysis"){
          url="ELECTROANAL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Desalination and Water Treatment"){
          url="DESALIN-WATER-TREAT";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Molecular Liquids"){
          url="J-MOL-LIQ";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Fluid Phase Equilibria"){
          url="FLUID-PHASE-EQUILIBR";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Electrical Engineering and Technology"){
          url="J-ELECTR-ENG-TECHNOL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Sustainability (Switzerland)"){
          url="SUSTAINABILITY-BASEL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Optik"){
          url="OPTIK";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Energies"){
          url="ENERGIES";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Electric Power Systems Research"){
          url="ELECTR-POW-SYST-RES";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="IEEE Transactions on Industrial Electronics"){
          url="IEEE-T-IND-ELECTRON";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Biological Macromolecules"){
          url="INT-J-BIOL-MACROMOL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Journal of Advanced Transportation"){
          url="J-ADV-TRANSPORT";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Water, Air, and Soil Pollution"){
          url="WATER-AIR-SOIL-POLL";
        }else{url=""}
        if(url!=""){
          var IF="";
          var annee=response.data.correspondingFollowedUser.publications[i].year;
        
          var IFScraper=await scraperService.getIFData(url);
          for(var j=0;j<IFScraper.data.author.name[0].year.length;j++){
            if(IFScraper.data.author.name[0].year[j]==annee){
              IF=IFScraper.data.author.name[0].IF[j];
              console.log("iiiiffff"+IF);
              const responseDB=userService.addIF({
                id:response.data.correspondingFollowedUser.user_id,
                title:response.data.correspondingFollowedUser.publications[i].title,
                IF: IF,
              
              })
            }
          }
 
          

        }
      }

      if (responseScrap.data.author) {
        console.log(responseScrap.data.author.citationsPerYear.length);
        console.log(response.data.correspondingFollowedUser.citationsPerYear.length);

        if(responseScrap.data.author.citationsPerYear.length>response.data.correspondingFollowedUser.citationsPerYear.length){
          userService.updateCitation(responseScrap.data.author);
          setCorrespondingFollowedUserCitation(responseScrap.data.author);

        }else if(responseScrap.data.author.citationsPerYear[responseScrap.data.author.citationsPerYear.length-1]!=response.data.correspondingFollowedUser.citationsPerYear[responseScrap.data.author.citationsPerYear.length-1]){
          userService.updateCitation(responseScrap.data.author);
          setCorrespondingFollowedUserCitation(responseScrap.data.author);
        }
       
      } 
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de profil" });
    }
  }, [id]);
    return (
      <div className="container">
        {profileUser !== null && (
          <Fragment>
            {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
              <div className="row">
                <div className="col-md-8">
                  {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
                    <Fragment>
                      <ProfileHeader
                        profile={{
                          ...correspondingFollowedUser,
                          ...profileUser,
                        }}
                      />
                      {(() => {
                          if (id==user._id) {
          return (
            <Publications
            author={correspondingFollowedUser}
            setAuthor={setCorrespondingFollowedUser}
            getProfile={getProfile}
          />
          )
        }  else {
          return (
            <PublicationsAuth
            author={correspondingFollowedUser}
            setAuthor={setCorrespondingFollowedUser}
            getProfile={getProfile}
          />
          )
        }
      })()}
                     
                    </Fragment>
                  )}
                </div>
                <div className="col-md-4">
                  <AuthorCitations author={correspondingFollowedUserCitation} />
                  <Coauthors author={correspondingFollowedUser} />
                </div>
              </div>
            )}
          </Fragment>
        )}
      </div>
    );

   
};

export default Profile;
