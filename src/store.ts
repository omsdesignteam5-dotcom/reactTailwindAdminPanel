import { createStore, type AnyAction } from "redux";

type SidebarState = {
  sidebarShow: boolean;
};

const initialState: SidebarState = {
  sidebarShow: true,
};

function changeState(
  state: SidebarState = initialState,
  action: AnyAction,
): SidebarState {
  switch (action.type) {
    case "set":
      return { ...state, ...action };
    default:
      return state;
  }
}

const store = createStore(changeState);

export default store;
