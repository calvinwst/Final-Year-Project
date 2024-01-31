import React, {createContext} from "react";

// Define your auth data interface
interface IAuthData {
    // Add your auth data properties here
    isLogged: boolean;
    userId?: string;
    token?: null | string;
    login: (token:string, userId:string) => void;
    logout: () => void;
    storeToken: (token: string) => void;
    storeUserId: (userId: string) => void;
    // user: any; // Replace any with your User type
  }

  
  
  // Initialize your AuthContext with an object of this type
  export const AuthContext = createContext<IAuthData>({
    isLogged: false,
    userId: null as any,
    token: null as any,
    login: () => {},
    logout: () => {},
    storeToken: (token: string) => {},
    storeUserId: (userId: string) => {},
    // user: null, // Replace null with your initial user data
  });