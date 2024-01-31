import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";

interface CustomContainerProps {
  children: React.ReactNode;
  name: string;
}

const CustomContainer: React.FC<CustomContainerProps> = ({
  children,
  name,
}) => {
  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          {children}
        </Stack>
      </Flex>
    </>
  );
};

export default CustomContainer;
