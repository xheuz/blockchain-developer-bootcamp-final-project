import React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import { ReactComponent as MetamaskOriginalIcon } from "../assets/metamask.svg";
import { useAppContext } from "../state/hooks";
import { useMetamaskConnect } from "../hooks/useWeb3";

export default function StyledButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      style={{
        textTransform: "capitalize",
        fontWeight: "bold",
        fontSize: 15,
        borderRadius: 20,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function WalletConnectButton() {
  const connectToMetamask = useMetamaskConnect();
  const { isButtonDisabled } = useAppContext();

  return (
    <StyledButton
      size="small"
      startIcon={
        <Avatar
          sx={{ bgcolor: "transparent !important", width: 26, height: 25 }}
          variant="rounded"
        >
          <MetamaskOriginalIcon />
        </Avatar>
      }
      onClick={!isButtonDisabled ? connectToMetamask : null}
      disabled={isButtonDisabled}
      sx={{ p: 2, paddingLeft: 3, paddingRight: 3 }}
    >
      Connect Metamask
    </StyledButton>
  );
}
