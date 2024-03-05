import React, { useState } from "react";
// import "./styles.scss";
import CustomForm from "../../components/customForm";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CustomStylesLogin, CustomStylesLoginBox } from "./styles";
import CustomContainer from "../../components/customContainer";
import { AuthContext } from "../../context/authContext";

interface LoginProps {
  setShowNav?(showNav: boolean): void;
}

const Login: React.FC<LoginProps> = ({ setShowNav }) => {
  const auth = React.useContext(AuthContext);
  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = (formData: any) => {
    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Login Successful",
            description: "You have successfully logged in.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return response.json();
        } else {
          toast({
            title: "Login Failed",
            description: "Please check your email and password.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        throw new Error("Login failed");
      })
      .then((data) => {
        const userId = data.userId;
        const token = data.token;
        const emailToken = data.emailToken;

        console.log("this is the  >>> ", emailToken);

        localStorage.setItem("token", token);
        localStorage.setItem("emailToken", emailToken);

        // Store the token and userId in the context
        auth.storeToken(token);
        auth.storeUserId(userId);

        auth.login(token, userId, emailToken);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <CustomContainer
        name="login"
        children={
          <>
            <CustomForm
              name="login"
              formFields={[
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "Enter your email",
                  required: true,
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Enter your password",
                  required: true,
                },
              ]}
              onSubmit={handleSubmit}
            />
          </>
        }
      />
    </>
  );
};

export default Login;
