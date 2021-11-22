import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { ReactComponent as LogoIcon } from "../assets/logo.svg";

import { useAppContext } from "../state/hooks";

export default function BottomBar() {
  const { showPage, setShowPage } = useAppContext();

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <Box sx={{ display: "flex", justifyContent: "center", zIndex: 1000 }}>
        <Fab
          color="default"
          aria-label="add"
          sx={{
            position: "absolute",
            bottom: 30,
            zIndex: 1000,
          }}
          value={"fab"}
          onClick={() => setShowPage("fab")}
        >
          <LogoIcon />
        </Fab>
      </Box>
      <BottomNavigation
        showLabels
        value={showPage}
        onChange={(event, newValue) => {
          setShowPage(newValue);
        }}
      >
        <BottomNavigationAction label="" icon={<HomeOutlinedIcon />} />
        <BottomNavigationAction label="" icon={<AddModeratorOutlinedIcon />} />
        {/* <BottomNavigationAction label="" icon={<SecurityOutlinedIcon />} /> */}
        {/* <BottomNavigationAction
          label=""
          icon={<AdminPanelSettingsOutlinedIcon />}
        /> */}
      </BottomNavigation>
    </Paper>
  );
}
