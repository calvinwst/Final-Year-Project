import React, { ChangeEvent, FormEvent, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import {
  Box,
  FormControl,
  Text,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useColorModeValue,
  Stack,
  HStack,
  InputGroup,
  InputRightElement,
  Link,
  Heading,
  Center,
} from "@chakra-ui/react";
import CustomButton from "../customButton";
import CustomContainer from "../customContainer";
import { sign } from "crypto";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface FormFieldOption {
  label: string;
  value: string;
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "password";
  placeholder: string;
  required: boolean;
  options?: FormFieldOption[]; // Only for type "select"
}

interface CustomFormProps {
  formFields: FormField[];
  onSubmit: (formData: any) => void;
  name?: string;
}

const CustomAuthForm: React.FC<CustomFormProps> = ({
  formFields,
  onSubmit,
  name,
}) => {
  // const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    location: "",
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((formData) => ({ ...formData, [id]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const navigate = useNavigate();

  return (
    <>
      <CustomContainer name="signup">
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            {name === "signup" ? "Sign Up" : "Login"}
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            {name === "signup" ? "Create an account" : "Login to your account"}
          </Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              {name === "signup" && (
                <>
                  <HStack>
                    <Box>
                      <FormControl id="firstName" isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          type="text"
                          onChange={handleInputChange}
                          value={formData.firstName}
                        />
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl id="lastName">
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          type="text"
                          onChange={handleInputChange}
                          value={formData.lastName}
                        />
                      </FormControl>
                    </Box>
                  </HStack>
                  <HStack>
                    <Box>
                      <FormControl id="specialty" isRequired>
                        <FormLabel>Specialty</FormLabel>
                        <Input
                          type="text"
                          onChange={handleInputChange}
                          value={formData.specialty}
                        />
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl id="location" isRequired>
                        <FormLabel>Location</FormLabel>
                        <Input
                          type="text"
                          onChange={handleInputChange}
                          value={formData.location}
                        />
                      </FormControl>
                    </Box>
                  </HStack>

                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      onChange={handleInputChange}
                      value={formData.username}
                    />
                  </FormControl>
                </>
              )}
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={handleInputChange}
                    value={formData.password}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  {name === "signup" ? "Sign Up" : "Login"}
                </Button>
                <Button
                  w={"full"}
                  maxW={"md"}
                  variant={"outline"}
                  leftIcon={<FcGoogle />}
                >
                  <Center>
                    <Text>Sign in with Google</Text>
                  </Center>
                </Button>
              </Stack>
              <Stack pt={6}>
                {name === "signup" ? (
                  <>
                    <Text align={"center"}>
                      Already a user?{" "}
                      <Link color={"blue.400"} href="/login">
                        Login
                      </Link>
                    </Text>
                  </>
                ) : (
                  <>
                    <Text align={"center"}>
                      New to us?{" "}
                      <Link color={"blue.400"} href="/sign-up">
                        Sign Up
                      </Link>
                    </Text>
                  </>
                )}
              </Stack>
            </Stack>
          </Box>
        </form>
      </CustomContainer>
    </>
  );
};

export default CustomAuthForm;
