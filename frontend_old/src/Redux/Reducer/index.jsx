const iSate = {
  isLogin: false,
  user: {
    token: "",
    token2: "",
    f_name: "",
    l_name: "",
    role: "",
    photo: "",
    employee_id: "",
  },
};

export const Reducer = (state = iSate, action) => {
  switch (action.type) {
    case "HANDLE_LOGIN": {
      console.log(action);
      return {
        ...state,
        isLogin: true,
        user: {
          ...state.user,
          token: action.payload.id,
          token2: action.payload.token2,
          role: action.payload.role,
          photo: action.payload.photo,
          employee_id: action.payload.employee_id,
          f_name:
            action.payload.f_name == undefined ? "" : action.payload.f_name,
          l_name:
            action.payload.l_name == undefined ? "" : action.payload.l_name,
        },
      };
    }
    case "HANDLE_LOGOUT": {
      return {
        ...state,
        isLogin: false,
        user: {
          ...state.user,
          token: "",
          token2: "",
          photo: "",
          role: "",
          f_name: "",
          l_name: "",
          employee_id: "",
        },
      };
    }
    case "UPDATE_TOKEN": {
      return {
        ...state,
        user: {
          ...state.user,
          token: action.payload.id,
        },
      };
    }
    default:
      return state;
  }
};
