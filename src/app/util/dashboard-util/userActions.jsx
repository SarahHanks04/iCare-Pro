export const logUserAction = (actionType, user, details = {}) => {
  try {
    console.log("logUserAction called with:", { actionType, user, details });
    if (!user.id || !user.first_name || !user.last_name) {
      throw new Error(
        "User object missing required fields (id, first_name, last_name)"
      );
    }

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
    console.log("New action to log:", newAction);
    localStorage.setItem("userActions", JSON.stringify(actions));
    console.log("Updated userActions in localStorage:", actions);

    console.log("Dispatching userActionLogged event...");
    window.dispatchEvent(new Event("userActionLogged"));
  } catch (error) {
    console.error("Error in logUserAction:", error);
  }
};
