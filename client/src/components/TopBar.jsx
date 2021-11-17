import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "./Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { ReactComponent as LogoIcon } from "../assets/logo.svg";
import Section from "./Section";

export default function TopBar({ accounts }) {
  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Section>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton>
              <LogoIcon width={"2em"} />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box>
            {!accounts ? (
              <Button
                size="small"
                startIcon={<AccountBalanceWalletOutlinedIcon />}
              >
                Connect Wallet
              </Button>
            ) : null}
          </Box>
        </Toolbar>
      </Section>
    </AppBar>
  );
}
