import React from 'react';
import { State } from "../models/state";

interface StateContext {
  state: State;
  setState: (statee: State) => void;
}

const StateContext = React.createContext<StateContext>({
  state: {
    selectedNavbarIndex: 0
  },
  setState: () => {}
});

export const StateProvider = ({ children }) => {
  const [state, setState] = React.useState({
    selectedNavbarIndex: 0
  });

  return (
    <StateContext.Provider value={{state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => React.useContext(StateContext);
