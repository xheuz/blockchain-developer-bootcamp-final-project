import React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import { ReactComponent as MetamaskOriginalIcon } from "../assets/metamask.svg";
import { useMetamaskConnect } from "../hooks/useWeb3";

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

export function WalletConnectButton() {
  const connect = useMetamaskConnect();
  return (
    <StyledButton
      size="small"
      startIcon={
        <Avatar variant="rounded">
          <MetamaskOriginalIcon />
        </Avatar>
      }
      onClick={connect}
    >
      Connect
    </StyledButton>
  );
}
