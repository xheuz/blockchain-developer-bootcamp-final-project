import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Section from "./Section";

export default function Page({ title, helpText, actionRight, actionLeft, children }) {
  return (
    <Section sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1, paddingTop: 3, paddingBottom: 1 }}>
        <Typography
          variant="h5"
          component="div"
          fontWeight={"bolder"}
          sx={{ textTransform: "capitalize" }}
        >
          {title}
        </Typography>
        <Typography variant="caption" component="div">
          {helpText}
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          paddingTop: 1,
          paddingBottom: 2,
          alignItems: "center"
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{actionLeft}</Box>
        {actionRight}
      </Box>
      {children}
    </Section>
  );
}
