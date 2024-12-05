"use client";
import { type JWTPayload } from "jose";
import React, {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";

type Session = JWTPayload | undefined;

const SessionContext = createContext<Session | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type SessionProviderProps = PropsWithChildren & {
  session: Session;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  session,
}) => {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};
