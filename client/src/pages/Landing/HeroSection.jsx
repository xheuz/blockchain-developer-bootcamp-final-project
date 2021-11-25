import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import Section from "../../components/Section";
import { ReactComponent as LogoIcon } from "../../assets/logo.svg";

import { WalletConnectButton } from "../../components/Button";

export default function HeroSection() {
  return (
    <Section
      sx={{
        flexGrow: 1,
        position: "absolute",
        bottom: 0,
        top: 0,
        right: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack spacing={10}>
        <Box sx={{ flexGrow: 1, textAlign: "center", marginBottom: 10 }}>
          <LogoIcon width={"12em"} />
          <Typography
            variant="h2"
            component="div"
            textAlign={"center"}
            fontWeight={"bolder"}
            gutterBottom
            marginTop={2}
          >
            Onyx Trust Wallet
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h5"
            component="div"
            color="primary"
            textAlign={"center"}
            fontWeight={100}
            sx={{ textTransform: "uppercase" }}
            gutterBottom
          >
            Keep taking care of your{" "}
            <Typography
              variant="h5"
              component="span"
              style={{ fontWeight: "bold" }}
              sx={{ fontStyle: "italic" }}
            >
              loved ones
            </Typography>
            , once you are gone
          </Typography>
          <Typography
            variant="h6"
            component="div"
            textAlign={"center"}
            gutterBottom
          >
            Top decentralized solution to guard your assets on the Ethereum
            blockchain
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, textAlign: "center", marginBottom: 2 }}>
          <WalletConnectButton />
        </Box>
      </Stack>
    </Section>
  );
}
