export const logUserAction = (actionType, user, details = {}) => {
  const actions = JSON.parse(localStorage.getItem("userActions")) || [];
  const newAction = {
    id: Date.now(),
    actionType,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    timestamp: new Date().toISOString(),
    details,
  };
  actions.unshift(newAction);
  localStorage.setItem("userActions", JSON.stringify(actions));

  window.dispatchEvent(new Event("userActionLogged"));
};
