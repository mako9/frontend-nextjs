import React from 'react'
import { State } from '../models/state'

interface StateContext {
    state: State
    setState: React.Dispatch<React.SetStateAction<State>>
}

const defaultState: State = {
    selectedNavbarIndex: 0,
    isLoading: false,
}

const StateContext = React.createContext<StateContext>({
    state: defaultState,
    setState: () => {},
})

export const StateProvider = ({ children }) => {
    const [state, setState] = React.useState(defaultState)

    return (
        <StateContext.Provider value={{ state, setState }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateValue = () => React.useContext(StateContext)
