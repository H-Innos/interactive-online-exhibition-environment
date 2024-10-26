"use client";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { configurations } from '~/constants/config';

interface MessageContextType {
  successMessage: string;
  errorMessage: string;
  setSuccessMessage: (message: string, autoClear?: boolean) => void;
  setErrorMessage: (message: string, autoClear?: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successAutoClear, setSuccessAutoClear] = useState(false);
  const [errorAutoClear, setErrorAutoClear] = useState(false);

  useEffect(() => {
    if (successMessage && successAutoClear) {
      const timer = setTimeout(() => setSuccessMessage(""), configurations.TIMEOUT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [successMessage, successAutoClear]);

  useEffect(() => {
    if (errorMessage && errorAutoClear) {
      const timer = setTimeout(() => setErrorMessage(""), configurations.TIMEOUT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, errorAutoClear]);

  const triggerSuccessMessage = (message: string, autoClear = true) => {
    setSuccessMessage(message);
    setSuccessAutoClear(autoClear);
  };

  const triggerErrorMessage = (message: string, autoClear = true) => {
    setErrorMessage(message);
    setErrorAutoClear(autoClear);
  };

  return (
    <MessageContext.Provider value={{
      successMessage,
      errorMessage,
      setSuccessMessage: triggerSuccessMessage,
      setErrorMessage: triggerErrorMessage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
