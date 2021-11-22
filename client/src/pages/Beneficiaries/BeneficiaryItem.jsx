import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAppContext } from "../../state/hooks";
import { useTestator } from "../../hooks/useTrustee";

export default function BeneficiaryItem({ beneficiary }) {
  const { fetchTrustBalance } = useTestator();
  const { setSelectedBeneficiary, setShowViewBeneficiaryDialog } =
    useAppContext();

  const { name, address } = beneficiary;

  const handleOnClick = async () => {
    fetchTrustBalance(beneficiary.trustAddress);
    setShowViewBeneficiaryDialog(true);
    setSelectedBeneficiary(beneficiary);
  };

  return (
    <Card elevation={2}>
      <CardActionArea onClick={handleOnClick}>
        <CardHeader
          avatar={
            <Avatar aria-label="beneficiary">
              {name.slice(0, 2).toUpperCase()}
            </Avatar>
          }
          action={<InfoOutlinedIcon color="primary" />}
          title={
            <Typography variant="subtitle1" component="div">
              {name}
            </Typography>
          }
        />
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#00AB55",
            color: "white",
            padding: 1,
          }}
        >
          <Typography variant="caption" component="div" textAlign="center">
            {address}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
