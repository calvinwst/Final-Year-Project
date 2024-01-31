import React from "react";
import { Spinner } from "@chakra-ui/react";

interface LoadingSpinnerProps {
  style?: React.CSSProperties;
}  
const LoadingSpinner:React.FC<LoadingSpinnerProps> = ({
  style
}) => {
  return (
    <>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        style={style}
        // style={{ margin: "auto" , marginTop: "20%", display: "block" ,  marginLeft: "auto", }}
      />
    </>
  );
};

export default LoadingSpinner;
