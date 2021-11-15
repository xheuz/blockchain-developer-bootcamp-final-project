import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";
import Filter3OutlinedIcon from "@mui/icons-material/Filter3Outlined";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import Section from "../components/Section";

const info = [
  {
    icon: <FavoriteBorderOutlinedIcon color="primary" sx={{ fontSize: 60 }} />,
    title: "Your love in the right hands",
    body: `Make sure your beneficiary is the only person that will get the assets.`,
  },
  {
    icon: <AccessTimeOutlinedIcon color="primary" sx={{ fontSize: 60 }} />,
    title: "Only when the time is right",
    body: `Assets will be available when you say they are, not a second before or after.`,
  },
  {
    icon: <ChangeCircleOutlinedIcon color="primary" sx={{ fontSize: 60 }} />,
    title: "You can change your mind",
    body: `If you regret it later, you can always withdraw your assets again or change beneficiary.`,
  }
];

function InfoBox({ icon, title, body }) {
  return (
    <Box
      sx={{
        minWidth: 275,
        flexGrow: 1,
        padding: 3,
        textAlign: "center",
      }}
      elevation={2}
    >
      <Box sx={{ marginBottom: 1 }}>{icon}</Box>
      <Typography
        variant="h6"
        component="div"
        fontWeight={"bolder"}
        textAlign={"center"}
        gutterBottom
      >
        {title}
      </Typography>
      <Typography variant="body1" component="p" textAlign={"center"}>
        {body}
      </Typography>
    </Box>
  );
}

export default function InfoSection() {
  return (
    <Section
      title="Become a Testator"
      subtitle={`A testator is a wise person who keeps loving event when it's gone.`}
      sx={{ padding: 2, flexGrow: 1, backgroundColor: "#FAFAFA" }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
      >
          {info.map((e,index) => (<InfoBox {...e} key={index}/>))}
      </Stack>
    </Section>
  );
}
