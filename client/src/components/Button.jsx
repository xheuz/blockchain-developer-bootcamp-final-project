import React from "react";
import Button from "@mui/material/Button";

export default function StyledButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      style={{
        textTransform: "capitalize",
        fontWeight: "bold",
        borderRadius: 50,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
