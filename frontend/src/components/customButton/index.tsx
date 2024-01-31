import React from "react";
import { Button } from "@chakra-ui/react";

interface CustomButtonProps {
  type: "submit" | "reset" | "button";
  text: string;
  color?: string;
  onClick?: () => void;
  mr?: number | number[] | string | string[];
  id?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type,
  text,
  color,
  onClick,
  mr,
  id,
}) => {
  return (
    <>
      <Button
        id={id}
        style={{ justifyContent: "center", width: "auto", marginTop: "1rem" }}
        type={type}
        colorScheme={color}
        onClick={onClick}
        size="lg"
        fontSize="md"
        mr={mr}
      >
        {text}
      </Button>
    </>
  );
};

export default CustomButton;
