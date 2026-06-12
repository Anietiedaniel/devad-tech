import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (
    accessToken: string,
    user: User
  ) => void;

  logout: () => void;

  updateUser: (
    user: User
  ) => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    const storedUser =
      localStorage.getItem("user");

    if (token) {
      setAccessToken(token);
    }

    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }
  }, []);

  const login = (
    token: string,
    userData: User
  ) => {
    localStorage.setItem(
      "accessToken",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "user"
    );

    setAccessToken(null);
    setUser(null);
  };

  const updateUser = (
    userData: User
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated:
          !!accessToken,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};