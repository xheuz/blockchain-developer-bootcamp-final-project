import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import Button from "../../components/Button";
import Page from "../../components/Page";
import EthereumIcon from "../../components/EthereumIcon";

import { ETHERSCAN_ADDRESS_URL } from "../../config";
import { useAppContext } from "../../state/hooks";
import { useTestator } from "../../hooks/useTrustee";

const LinkIcon = ({ children, to, sx, color = "primary" }) => {
  return (
    <a
      href={to}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "none" }}
    >
      <IconButton color={color} sx={sx}>
        {children}
      </IconButton>
    </a>
  );
};

const style = {
  beneficiary: {
    iconBackground: "#00AB55",
  },
};

export default function BeneficiaryDetailsCard() {
  const {
    trustBalance,
    selectedBeneficiary,
    removeBeneficiary,
    setShowViewBeneficiaryDialog,
  } = useAppContext();
  const { depositEth, deleteBeneficiary, fetchTrustBalance } = useTestator();
  const [amount, setAmount] = React.useState(0);
  const { name, address, trustAddress } = selectedBeneficiary;

  const handleOnSubmit = async () => {
    await depositEth(address, amount);
    await fetchTrustBalance(trustAddress);
  };
  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDelete = async () => {
    await deleteBeneficiary(address);
    removeBeneficiary(selectedBeneficiary);
    setShowViewBeneficiaryDialog(false);
  };

  return (
    <Page title="Beneficiary" helpText="Details About Your Beneficiary">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar
                  aria-label="beneficiary"
                  sx={{ backgroundColor: style.beneficiary.iconBackground }}
                >
                  <ShieldOutlinedIcon />
                </Avatar>
              }
              action={
                <LinkIcon to={`${ETHERSCAN_ADDRESS_URL}/${address}`}>
                  <LaunchOutlinedIcon />
                </LinkIcon>
              }
              title={
                <Typography variant="h5" component="div" textAlign="center">
                  {name}
                </Typography>
              }
            />
            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: style.beneficiary.iconBackground,
                color: "white",
                fontWeight: "bold",
                padding: 1,
              }}
            >
              <Typography variant="caption" component="div" textAlign="center">
                {address}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar sx={{ backgroundColor: "#3366FF" }}>
                  <SecurityOutlinedIcon />
                </Avatar>
              }
              title={
                <Typography variant="h5" component="div" textAlign="center">
                  Trust Balance
                </Typography>
              }
              action={
                <LinkIcon
                  color="default"
                  to={`${ETHERSCAN_ADDRESS_URL}/${address}`}
                  sx={{ color: "#3366FF" }}
                >
                  <LaunchOutlinedIcon />
                </LinkIcon>
              }
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {/* <Box component="div" sx={{ flexGrow: 1 }} /> */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ backgroundColor: "white" }}>
                    <EthereumIcon color="secondary" />
                  </Avatar>
                  <Typography
                    variant="h6"
                    component="div"
                    textAlign="center"
                    sx={{ flexGrow: 1 }}
                  >
                    {trustBalance} ETH
                  </Typography>
                </Box>
              </Box>
              <Box component="form" onSubmit={(e) => e.preventDefault()}>
                <TextField
                  color="secondary"
                  type="number"
                  value={amount}
                  onChange={handleOnChange}
                />
                <Button color="secondary" onClick={handleOnSubmit}>
                  Send
                </Button>
              </Box>
            </CardContent>
            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: "#3366FF",
                color: "white",
                fontWeight: "bold",
                padding: 1,
              }}
            >
              <Typography
                variant="caption"
                component="div"
                textAlign="center"
                color=""
              >
                {trustAddress}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="error"
            variant="outlined"
            fullWidth
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Page>
  );
}
