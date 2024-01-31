import React from 'react';
import { Grid } from '@chakra-ui/react';

interface CustomGridLayoutProps {
    children: React.ReactNode;
}

const CustomGridLayout: React.FC<CustomGridLayoutProps> = ({ children }) => {
    return (
        <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
        >
            {children}
        </Grid>
    );
}



export default CustomGridLayout;
