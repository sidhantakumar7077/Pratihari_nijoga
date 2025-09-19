import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * @typedef {Object} FormContextType
 * @property {boolean} isLoading
 * @property {(loading: boolean) => void} setIsLoading
 * @property {boolean} showSuccess
 * @property {(show: boolean) => void} setShowSuccess
 */

const FormContext = createContext(undefined);

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};

/**
 * @typedef {Object} FormProviderProps
 * @property {ReactNode} children
 */

export const FormProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    return (
        <FormContext.Provider value={{
            isLoading,
            setIsLoading,
            showSuccess,
            setShowSuccess,
        }}>
            {children}
        </FormContext.Provider>
    );
};