const userShortBio = ({
  laboratoriesHeaded,
  teamsHeaded,
  teamsMemberships,
  establishmentsDirected,
  ...user
}) => {
  if (user.roles.includes("CED_HEAD")) return ["chef de CED"];
  if (user.roles.includes("VICE_CED_HEAD")) return ["Vice Président Chargé de la Recherche Scientifique"];

  const roles = [];
  roles.push(laboratoriesHeaded
    .map(({ abbreviation }) => `chef de laboratoire ${abbreviation}`)
    .join(" , "));

  roles.push(teamsHeaded
    .map(({ abbreviation }) => `chef de l'équipe ${abbreviation}`)
    .join(" , "));

  /*roles.push(teamsMemberships
    .map(({ abbreviation }) => `membre de l'équipe ${abbreviation}`)
    .join(" , "));*/

  roles.push(establishmentsDirected
    .map(({ abbreviation }) => `Directeur de recherche de ${abbreviation}`)
    .join(" , "));
 
  let shortBio = []
   for(var i=0 ;i<roles.length;i++){
    if (roles[i] !== "") 
    {
      if(i===(roles.length-1)){
        shortBio.push(roles[i] + " ")
      }else if(i!==(roles.length-1) ){
        if(roles[i+1]!==""){
          shortBio.push(roles[i] + ", ")
        }else{
          shortBio.push(roles[i] + " ")
        }
        
      }
      
    }
  }

  if(!shortBio.length)
    shortBio = ["Chercheur"];

  
    return shortBio;
  /*if (shortBio.length > 10) return shortBio;
  else return "Chercheur";*/

};

const userHeadedLaboratories = ({ laboratoriesHeaded }) =>
  laboratoriesHeaded.map(({ name, abbreviation }) => abbreviation).join(" , ");

const UserHelper = {
  userShortBio,
  userHeadedLaboratories,
};

export { UserHelper };
