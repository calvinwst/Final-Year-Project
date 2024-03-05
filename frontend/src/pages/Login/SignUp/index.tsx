import React from "react";
import CustomAuthForm from "../../../components/customForm";
import CustomContainer from "../../../components/customContainer";
import { Heading, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmitSign = (formData: any) => {
    console.log("this formData is from sign up", formData);
    fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Sign Up Successful",
            description: "You have successfully signed up.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return response.json();
        } else {
          toast({
            title: "Sign Up Failed",
            description: "Please check your email and password.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        throw new Error("Sign up failed"); // Throw an error if the response is not okay
      })
      .then((data) => {
        console.log(data);
        const userId = data.userId;
        const token = data.token;
        console.log("this is the userId", userId);
        console.log("this is the token", token);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <CustomContainer
        name="signup"
        children={
          <>
            <CustomAuthForm
              name="signup"
              formFields={[
                {
                  name: "username",
                  label: "Username",
                  type: "text",
                  placeholder: "Enter your username",
                  required: true,
                },
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
                {
                  name: "firstName",
                  label: "First Name",
                  type: "text",
                  placeholder: "Enter your first name",
                  required: true,
                },
                {
                  name: "lastName",
                  label: "Last Name",
                  type: "text",
                  placeholder: "Enter your last name",
                  required: true,
                },
              ]}
              onSubmit={handleSubmitSign}
            />
          </>
        }
      />
    </>
  );
};

export default SignUp;
