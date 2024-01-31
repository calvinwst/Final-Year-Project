import React, { useState } from "react";
// import "./styles.scss";
import CustomForm from "../../components/customForm";
import { Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CustomStylesLogin, CustomStylesLoginBox } from "./styles";
import CustomContainer from "../../components/customContainer";
import { AuthContext } from "../../context/authContext";

interface LoginProps {
  setShowNav?(showNav: boolean): void;
}

const Login: React.FC<LoginProps> = ({ setShowNav }) => {
  // const [showNav, setShowNav] = useState(false);
  const auth = React.useContext(AuthContext);

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
          return response.json();
        }

        throw new Error("Login failed");
      })
      .then((data) => {
        const userId = data.userId;
        const token = data.token;

        localStorage.setItem("token", token);

        // Store the token and userId in the context
        auth.storeToken(token);
        auth.storeUserId(userId);


        auth.login(token, userId);
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
