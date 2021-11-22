import React from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Section from "./Section";
import Gavatar from "./Gavatar";
import EthereumIcon from "./EthereumIcon";
import { useAppContext } from "../state/hooks";
import { useMetamaskConnect } from "../hooks/useWeb3";
import { shortenAddress } from "../utils/format";

import { ReactComponent as MetamaskOriginalIcon } from "../assets/metamask.svg";

const ChipAvatar = ({ address }) => {
  return (
    <Chip
      avatar={
        <Avatar sx={{ bgcolor: "white !important" }}>
          <Gavatar hash={address} />
        </Avatar>
      }
      label={shortenAddress(address)}
      variant="contained"
      color="secondary"
      sx={{ fontWeight: "bold" }}
    />
  );
};

const MetamaskConnectChip = () => {
  const connectToMetamask = useMetamaskConnect();
  const { isButtonDisabled } = useAppContext();

  return (
    <Chip
      avatar={
        <Avatar sx={{ bgcolor: "transparent !important" }} variant="rounded">
          <MetamaskOriginalIcon />
        </Avatar>
      }
      label={"Connect Wallet"}
      variant={!isButtonDisabled ? "contained": "outlined"}
      onClick={!isButtonDisabled ? connectToMetamask : null}
      color={!isButtonDisabled ? "secondary": "default"}
      sx={{ padding: 1 }}
    />
  );
};

export default function TopBar() {
  const { isConnected, balance, currentAccount } = useAppContext();

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={1}
      sx={{ padding: 0, m: 0 }}
    >
      <Section>
        <Toolbar>
          <Box>
            {isConnected ? (
              <Chip
                avatar={
                  <Avatar sx={{ backgroundColor: "white !important" }}>
                    <EthereumIcon color="secondary" />
                  </Avatar>
                }
                label={`${balance} ETH`}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: "bold" }}
              />
            ) : null}
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box>
            {isConnected ? (
              <ChipAvatar address={currentAccount} />
            ) : (
              // <Button
              //   size="small"
              //   startIcon={<AccountBalanceWalletOutlinedIcon />}
              //   onClick={handleConnect}
              // >
              //   Connect Wallet
              // </Button>
              <MetamaskConnectChip />
            )}
          </Box>
        </Toolbar>
      </Section>
    </AppBar>
  );
}
