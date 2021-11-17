import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import RemoveModeratorOutlinedIcon from "@mui/icons-material/RemoveModeratorOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Page from "../components/Page";
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function Home() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Page
        title={"Beneficiaries"}
        action={
          <Button
            color="primary"
            style={{
              textTransform: "capitalize",
              fontWeight: "bold",
              borderRadius: 50,
            }}
            variant="contained"
            startIcon={<AddOutlinedIcon />}
          >New Beneficiary</Button>
        }
      >
        {/* <Box>You don't have beneficiaries yet.</Box> */}
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item sx={6} md={6}>
            <Link to="/landing">
              <Card elevation={3}>
                <CardHeader
                  avatar={<Avatar aria-label="beneficiary">VN</Avatar>}
                  action={
                    <IconButton color="error">
                      <RemoveModeratorOutlinedIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="subtitle1" component="div">
                      Veronika Natschke
                    </Typography>
                  }
                  subheader={
                    <Typography variant="caption" component="div">
                      Nov 15 2021
                    </Typography>
                  }
                />
                <Box
                  sx={{
                    flexGrow: 1,
                    backgroundColor: "#00AB55",
                    padding: 1,
                    paddingLeft: 2,
                    paddingRight: 2,
                  }}
                >
                  <Typography
                    variant="overline"
                    component="div"
                    sx={{ color: "white" }}
                  >
                    0xCf0f71C4D8553d8d72FC22EC1D8c45DA177BdCE3
                  </Typography>
                </Box>
              </Card>
            </Link>
          </Grid>
          <Grid item sx={6} md={6}>
            <Card elevation={3}>
              <CardHeader
                avatar={<Avatar aria-label="beneficiary">VN</Avatar>}
                action={
                  <IconButton color="error">
                    <RemoveModeratorOutlinedIcon />
                  </IconButton>
                }
                title={
                  <Typography variant="subtitle1" component="div">
                    Veronika Natschke
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" component="div">
                    Nov 15 2021
                  </Typography>
                }
              />
              <Box
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#00AB55",
                  padding: 1,
                  paddingLeft: 2,
                  paddingRight: 2,
                }}
              >
                <Typography
                  variant="overline"
                  component="div"
                  sx={{ color: "white" }}
                >
                  0xCf0f71C4D8553d8d72FC22EC1D8c45DA177BdCE3
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Page>
    </>
  );
}
