import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { ReactComponent as LogoIcon } from "../assets/logo.svg";
import Section from "./Section";

export default function TopBar() {
  return (
    <Section>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton>
              <LogoIcon width={"2em"} />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: { xs: "flex", md: "flex", lg: "flex" } }}>
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ mr: 2, display: { xl: "none", xs: "block" } }}
            >
              <SettingsOutlinedIcon />
            </IconButton>
            <Button
              variant="contained"
              style={{
                textTransform: "capitalize",
                fontWeight: "bold",
                borderRadius: 50,
              }}
              size="medium"
              startIcon={<AccountBalanceWalletOutlinedIcon />}
            >
              Connect Wallet
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Section>
  );
}
