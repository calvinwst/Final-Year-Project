import styled from "styled-components";
import { Box, Button } from "@chakra-ui/react";

const CustomStylesNav = styled(Box)`
  position: fixed; // Keep navbar fixed at the top
  top: 0; // Position it at the very top of the viewport
  width: 100%; // Stretch across the full viewport width
  z-index: 10; // Make sure it appears above other page elements
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

export { CustomStylesNav };
