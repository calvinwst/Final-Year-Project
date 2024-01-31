import styled from "styled-components";
import { Flex, Box } from "@chakra-ui/react";

const CustomStylesLogin = styled(Flex)`
    background-color: #319795;
    padding: 0.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
        font-size: 1rem;

        font-weight: bold;
        color: white;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
    }
    button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
`;

const CustomStylesLoginBox = styled(Box)`

    background-color: #319795;
    padding: 0.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
        font-size: 1rem;
    }
    button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
`;

export { CustomStylesLogin, CustomStylesLoginBox };
        