import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import RemoveModeratorOutlinedIcon from "@mui/icons-material/RemoveModeratorOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Section from "../components/Section";
import InfoSection from "../containers/InfoSection";
import CounterSection from "../containers/CountersSection";
import { ReactComponent as LogoIcon } from "../assets/logo.svg";

export default function Home() {
  return (
    <>
      <Section sx={{ flexGrow: 1, paddingBottom: 2 }}>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <LogoIcon width={"12em"} />
          </Box>
        <Typography
          variant="h2"
          component="div"
          textAlign={"center"}
          fontWeight={"bolder"}
          gutterBottom
          marginTop={2}
        >
          Onyx Trust
        </Typography>
        <Typography
          variant="h4"
          component="div"
          textAlign={"center"}
          fontWeight={100}
          sx={{textTransform:"uppercase"}}
          gutterBottom
        >
          Top decentralized solution to guard your assets
        </Typography>
        <Typography
          variant="h6"
          component="div"
          textAlign={"center"}
          gutterBottom
        >
          Keep taking care of your{" "}
          <Typography
            variant="h6"
            component="span"
            style={{ fontWeight: "bold" }}
            sx={{ fontStyle: "italic" }}
          >
            love ones
          </Typography>
          , once you are gone.
        </Typography>
        
        {/* <SecurityOutlinedIcon />
        <EnhancedEncryptionOutlinedIcon />
        <VerifiedUserOutlinedIcon />
        <AddModeratorOutlinedIcon />
        <RemoveModeratorOutlinedIcon /> */}
      </Section>
      <InfoSection />
      <CounterSection />
    </>
  );
}
