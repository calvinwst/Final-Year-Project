import React, { useState, useEffect, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import CustomNav from "./components/customNav/index";
import Login from "./pages/Login/index";
import CommunityProfile from "./pages/CommunityProfile/index";
import UserFeed from "./pages/UserFeed/index";
import Listing from "./pages/Listing/index";
import UserProfile from "./pages/UserProfile/index";
import Notification from "./pages/Notification/index";
import SignUp from "./pages/Login/SignUp";
import ResearchDetails from "./pages/Listing/details";
import CommunityDetails from "./pages/CommunityProfile/details";
import Network from "./pages/Network";
import { AuthContext } from "./context/authContext";
import ProtectedRoute from "./routes/ProtectRoute/index";
import NetworkDetails from "./pages/Network/details";
import UserFeedDetails from "./pages/UserFeed/details";
import { useLocation } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import Chat from "./pages/Chat";
import MessageDetails from "./pages/Chat/messageDetails";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // to check if is logged in if not denied access
  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (!isLogged) {
  //     navigate("/login");
  //   }
  // }, [isLogged, navigate]);

  //this is cause the problem of not allow to direct to sign-up page when not logged in and also when refresh the page
  // it cause the page to go back to login page but the navbar show the tab and allow user to access the page
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedIsLogged = localStorage.getItem("isLogged");
    console.log("this is storedToken in app", storedToken);
    if (storedToken && storedUserId && storedIsLogged) {
      setIsLogged(storedIsLogged === "true"); // Convert string to boolean
      setToken(storedToken);
      setUserId(storedUserId);
    } else if (
      location.pathname !== "/login" &&
      location.pathname !== "/sign-up"
    ) {
      // navigate("/login");
      setIsLogged(false);
      setToken("");
      setUserId("");
    }
    setLoading(false);
  }, [navigate, location]);

  const login = useCallback((token: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("isLogged", "true");
    setIsLogged(true);
    setToken(token);
    setUserId(userId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLogged");
    setIsLogged(false);
    setToken("");
    setUserId("");
    navigate("/login");
  }, []);

  const storeToken = useCallback((token: string) => {
    console.log("this is token in storeToken in app", token);
    setToken(token);
  }, []);

  const storeUserId = useCallback((userId: string) => {
    setUserId(userId);
    console.log("this is userId in storeUserId", userId);
  }, []);

  console.log("this is the token in app >>", token);
  console.log("this is the userId in app >>", userId);
  return (
    <AuthContext.Provider
      value={{
        isLogged: isLogged,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        storeToken: storeToken,
        storeUserId: storeUserId,
      }}
    >
      <CustomNav />
      <Routes>
        <Route path="/" element={<UserFeed />} />
        <Route path="/userfeed" element={<UserFeed />} />
        <Route path="/userfeed/:userFeedID" element={<UserFeedDetails />} />
        {/*Public Route*/}
        <Route path="/login" element={<Login setShowNav={setShowNav} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/research/:researchId" element={<ResearchDetails />} />
        <Route path="/community/:communityId" element={<CommunityDetails />} />
        <Route path="/network/:networkId" element={<NetworkDetails />} />
        {/* <Route path="/userfeed/:userFeedid" element={<UserFeedDetails />} /> */}
        {/*Public Route*/}

        {/* Protected Routes */}
        <Route
          path="/communityProfile"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <CommunityProfile setShowNav={setShowNav} />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/communityProfile/:communityId"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <CommunityDetails />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/research"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <Listing />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/research/:researchId"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <ResearchDetails />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/userProfile/"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userProfile/:userId"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <NetworkDetails />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              {/* <Notification setShowNav={setShowNav} /> */}
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <Network />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:researchId"
          element={
            <ProtectedRoute isLogged={isLogged} loading={loading}>
              <MessageDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
