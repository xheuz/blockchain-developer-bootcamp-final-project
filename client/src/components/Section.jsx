import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

export default function Section({
  children,
  title = null,
  subtitle = null,
  ...props
}) {
  return (
    <Box sx={{ flexGrow: 1 }} {...props}>
      <Container maxWidth={"md"}>
        {title ? (
          <Typography
            variant="h4"
            fontWeight={"bolder"}
            textAlign={"center"}
            gutterBottom
          >
            {title}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography
            variant="subtitle1"
            textAlign={"center"}
            sx={{ textTransform: "uppercase" }}
            gutterBottom
          >
            {subtitle}
          </Typography>
        ) : null}
        {children}
      </Container>
    </Box>
  );
}
