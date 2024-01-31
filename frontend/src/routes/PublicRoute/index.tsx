import React from "react";
import { Route, Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
  isLogged: boolean;
  path: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  isLogged,
  ...rest
}) => {
  return isLogged ? (
    <Navigate
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <Route {...rest} element={children} />
  );
};

export default PublicRoute;
