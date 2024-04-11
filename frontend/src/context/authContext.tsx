import React, { createContext } from "react";

// Define your auth data interface
interface INotification {
  _id: string;
  message: string;
  read: boolean;
  // ... other properties of notifications
}
interface IAuthData {
  // Add your auth data properties here
  isLogged: boolean;
  userId?: string;
  token?: null | string;
  login: (token: string, userId: string, emailToken?: string) => void;
  logout: () => void;
  storeToken: (token: string) => void;
  storeUserId: (userId: string) => void;
  notifications?: INotification[];
  setNotifications?: React.Dispatch<React.SetStateAction<INotification[]>>;
  markNotificationAsRead?: (notificationId: string) => void;
  unreadNotifications?: any;
  decreaseUnreadNotificationsCount: () => void;
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
  notifications: [],
  setNotifications: () => {}, // This will be overridden by the actual setState function
  markNotificationAsRead: () => {}, // We'll implement this function in the provider
  decreaseUnreadNotificationsCount: () => {},
  // user: null, // Replace null with your initial user data
});
