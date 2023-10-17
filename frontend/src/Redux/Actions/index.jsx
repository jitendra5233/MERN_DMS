export const handleLogin = (data) => {
  return {
    type: "HANDLE_LOGIN",
    payload: data,
  };
};

export const handleLogoutAc = (data) => {
  return {
    type: "HANDLE_LOGOUT",
    payload: data,
  };
};

export const updateUserToken = (data) => {
  return {
    type: "UPDATE_TOKEN",
    payload: data,
  };
};
