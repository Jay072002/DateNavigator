import React, { createContext, useContext } from 'react';

// Create a context object
const MyContext = createContext();

// Create a custom hook to access the context
export const AppContext = () => {
    return useContext(MyContext);
};

// Create a context provider component
export const MyContextProvider = ({ children }) => {

    // define global state here

    return (
        <MyContext.Provider value={""}>
            {children}
        </MyContext.Provider>
    );
};
