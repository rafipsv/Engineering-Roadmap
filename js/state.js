/**
 * Global State Management
 */
export const state = {
  C: null,
  P: null,
  currentView: "dashboard",
  activePhase: "All",
  activeMonth: "All",
  activeStatus: "All",
  activeTopic: null,
  searchTerm: "",
  modalWeekId: null,
  modalProjectId: null,
  previousModalWeekId: null,
};

export const setC = (val) => {
  state.C = val;
};

export const setP = (val) => {
  state.P = val;
};
