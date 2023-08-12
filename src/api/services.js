const makeAuthentificationService = (api) => ({
  signup: (user) => api.post(`/signup`, user),
  login: (user) => api.post(`/login`, user),
});

const makeScraperService = (api) => ({
  authorSearch: (authorName) => api.get(`/author-search/${authorName}`),
  getAuthorData: (platform, authorId) =>
    api.get(`/author/${platform}/${authorId}`),
  getJournalData: (jouranlName, year) => api.get(`/journal/${jouranlName}/${year}`),
  getIFData:(source)=>api.get(`/IF/${source}`)
});

const makeUserService = (api) => ({
  findAllPublications: () => api.get("/publications"),
  findAllReasearchersOfLab: (_id) => api.get(`/users/lab/${_id}`),
  addPub:(pub)=>api.post(`/add-pub`,pub),
  updatePub:(pub)=> api.post(`/update-pub`,pub),
  deletePub:(pub)=>api.post(`/delete-pub`,pub),
  updateCitation:(citation)=>api.post(`/update-citation`,citation),
  addSJR:(SJR)=>api.post(`/add-SJR`,SJR),
  addIF:(IF)=>api.post(`/add-IF`,IF),
  createUser: (user) => api.post(`/users`, user),
  updateUser: (user) => api.put(`/users`, user),
  findUser: (_id) => api.get(`/users/${_id}`),
  findAllUsers: () => api.get(`/users`),
  deleteUser: (_id) => api.delete(`/users/${_id}`),
  updatePassword: (_id, passwords) =>
    api.post(`/users/${_id}/update-password`, passwords),
  updateProfilePicture: (formData) =>
    api.post(`/upload-profile-picture`, formData),
  getLaboratoryHeads: () => api.get(`/laboratory-heads`),
  getResearchers: () => api.get(`/researchers`),
  followUser: (user) => api.post(`/follow`, user),
  updateFollowUser: (user) => api.post(`/update-followed-user`, user),
  unfollowUser: (authorId) => api.get(`/unfollow/${authorId}`),
  isFollowing: (authorId) => api.get(`/is-following/${authorId}`),
  getFollowedUsers: (filter) => api.get(`/followed-users`, { params: filter }),
  getFilteringOptions: (laboratoryHeadId) =>
    api.get(`/filtering-options/${laboratoryHeadId}`),
  getDirectorFilteringOptions: (directorId) => api.get(`/director-filtering-options/${directorId}`),

});

const makeGalerieUploadService = (api) => ({
  createGalerie: (formData) => api.post(`/galerie`, formData),
  findAllGaleries: (_id) => api.get(`/galerie/${_id}`),
  findGalerie: (_id,_doc) => api.get(`/galerie/doc/${_id}/${_doc}`),
  deleteGalerie: (_id) => api.delete(`/galerie/${_id}`),
  removeElement: (type,racine,element)=>api.post("/galerie/removeElement",{type,racine,element}),
  findGalerieById :(_id)=>api.get(`/galerie/findOne/${_id}`),
  pushFile :(form)=>api.post("/galerie/pushFile",form)
})
const makeProjetsService = (api) => ({
  createProjet: (projet) => api.post(`/projets`, projet),
  updateProjet: (projet) => api.put(`/projets`, projet),
  findProjet: (_id) => api.get(`/projets/${_id}`),
  findAllProjets: () => api.get(`/projets`),
  deleteProjet: (_id) => api.delete(`/projets/${_id}`)
});

const makeMotService = (api) => ({
  createMot: (mot) => api.post(`/mots`, mot),
  updateMot: (mot) => api.put(`/mots`, mot),
  findMot: (_id) => api.get(`/mots/${_id}`),
  findAllMots: () => api.get(`/mots`),
  deleteMot: (_id) => api.delete(`/mots/${_id}`)
});

// const makePhdService = (api) => ({
//   createUser: (user) => api.post(`/users`, user),
//   updateUser: (user) => api.put(`/users`, user),
//   findUser: (_id) => api.get(`/users/${_id}`),
//   findAllUsers: () => api.get(`/users`),
//   deleteUser: (_id) => api.delete(`/users/${_id}`),
// });
const makeBudgetHistoryService = (api)=>({
  addBudgetHistory:(budget)=>api.post("/addBudgetHistory",budget),
  findHistory:(filter)=>api.get(`findHistory/${filter.laboratory_id}`)
})

const makePvUploadService = (api) => ({
  createPv: (formData) => api.post(`/pv`, formData),
  findAllPvs: (_id) => api.get(`/pv/${_id}`),
  findPv: (_id,_doc) => api.get(`/pv/doc/${_id}/${_doc}`),
  deletePv: (_id) => api.delete(`/pv/${_id}`),
  removeElement: (type,racine,element)=>api.post("/pv/removeElement",{type,racine,element}),
  findPvById :(_id)=>api.get(`/pv/findOne/${_id}`),
  pushFile :(form)=>api.post("/pv/pushFile",form)
})


const makeUniversityService = (api) => ({
  createUniversity: (university) => api.post(`/universities`, university),
  updateUniversity: (university) => api.put(`/universities`, university),
  findUniversity: (_id) => api.get(`/universities/${_id}`),
  findAllUniversities: () => api.get(`/universities`),
  deleteUniversity: (_id) => api.delete(`/universities/${_id}`),
  getUniversityEstablishments: (_id) => api.get(`/universities/${_id}/establishments`)
});

const makeEstablishmentService = (api) => ({
  createEstablishment: (establishment) => api.post(`/establishments`, establishment),
  updateEstablishment: (establishment) => api.put(`/establishments`, establishment),
  findEstablishment: (_id) => api.get(`/establishments/${_id}`),
  findAllEstablishments: () => api.get(`/establishments`),
  deleteEstablishment: (_id) => api.delete(`/establishments/${_id}`),
  getEstablishmentLaboratories: (_id) => api.get(`/establishments/${_id}/laboratories`),
  setEstablishmentResearchDirector: (establishment_id, user_id) => api.post(`/research-director/${establishment_id}/${user_id}`),
  getEstablishmentOfDirector: (director_id) => api.get(`/establishment-of-director/${director_id}`)
});

const makeLaboratoryService = (api) => ({
  createLaboratory: (laboratory) => api.post(`/laboratories`, laboratory),
  updateLaboratory: (laboratory) => api.put(`/laboratories`, laboratory),
  findLaboratory: (_id) => api.get(`/laboratories/${_id}`),
  findAllLaboratories: () => api.get(`/laboratories`),
  deleteLaboratory: (_id) => api.delete(`/laboratories/${_id}`),
  getTeamsOfLaboratory: (_id) => api.get(`/laboratories/${_id}/teams`),
  getLaboratoryOfHead: (head_id) => api.get(`/laboratories-of-head/${head_id}`),
  getFreeLaboratories: () => api.get(`/free-laboratories`),
  associateHeadToLaboratory: (head_id, lab_id) =>
    api.get(`/entitle-laboratory/${head_id}/${lab_id}`),
  getLaboratoriesOfDirector: (user_id) => api.get(`/laboratories-of-director/${user_id}`),
  getNodesForOrgChart: () => api.get(`/nodesForOrgChart`)
});

const makeTeamService = (api) => ({
  createTeam: (team) => api.post(`/teams`, team),
  //createTeam:(team)=> console.log(team),
  updateTeam: (team) => api.put(`/teams`, team),
  findAllTeams: () => api.get(`/teams`),
  findTeam: (_id) => api.get(`/teams/${_id}`),
  deleteTeam: (_id) => api.delete(`/teams/${_id}`),
  addUserToTeam: (team_id, user_id) =>
    api.get(`/add-to-team/${team_id}/${user_id}`),
  removeFromTeam: (team_id, user_id) =>
    api.get(`/remove-from-team/${team_id}/${user_id}`),
  associateHeadToTeam: (team_id, head_id) =>
    api.get(`/team-head-association/${team_id}/${head_id}`),
});
const makePhdStudentsService = (api) => ({
  createPhdStudent: (phdStudent) => api.post(`/phdStudents`, phdStudent),
  updatePhdStudent: (phdStudent) => api.put(`/phdStudents`, phdStudent),
  findAllPhdStudents: (_id) => api.get(`/phdStudents`),
  findstudent: (_id) => api.get(`/phdStudents/${_id}`),
  deletePhdStudent: (_id) => api.delete(`/phdStudents/${_id}`),
  findStudentsOfUser: () => api.get(`/phdStudentsOfUser`),
  findPhdStudentOfLab : ()=>api.get(`/phdStudentsLabs/`)
});

const makeStatisticsService = (api) => ({
  getStatistics: (filter) => api.get(`/statistics`, { params: filter }),
  getPublicationsPerTeam: (filter) => api.get(`/team-publications`, { params: filter }),

});

const makeNotificationsService = (api) => ({
  findUserNotifications: (user_id) => api.get(`/notifications/${user_id}`),
  notifyFolloweers: ({
    publication,
    followedUserId,
    author_user_id,
    authorId,
  }) =>
    api.post(`/notify-followers`, {
      publication,
      followed_user_id: followedUserId,
      author_id: authorId,
      author_user_id
    }),
  markNotificationAsRead: (notificationId) =>
    api.post(`/mark-notification-as-read/${notificationId}`),
});

export {
  makeUserService,
  makeUniversityService,
  makeEstablishmentService,
  makeLaboratoryService,
  makeTeamService,
  makePhdStudentsService,
  makeScraperService,
  makeAuthentificationService,
  makeStatisticsService,
  makeNotificationsService,
  makePvUploadService,
  
  makeGalerieUploadService,
  makeProjetsService,
  makeMotService,

  makeBudgetHistoryService,
};
