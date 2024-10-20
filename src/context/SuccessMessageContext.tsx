"use client";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { configurations } from '~/constants/config';

interface SuccessMessageContextType {
  successMessage: string;
  setSuccessMessage: (message: string) => void;
}

const SuccessMessageContext = createContext<SuccessMessageContextType | undefined>(undefined);

export const SuccessMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), configurations.TIMEOUT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <SuccessMessageContext.Provider value={{ successMessage, setSuccessMessage }}>
      {children}
    </SuccessMessageContext.Provider>
  );
};

export const useSuccessMessage = (): SuccessMessageContextType => {
  const context = useContext(SuccessMessageContext);
  if (!context) {
    throw new Error("useSuccessMessage must be used within a SuccessMessageProvider");
  }
  return context;
};
