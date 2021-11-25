import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import ChipAvatar from "../../components/ChipAvatar";

export default function WalletCard({
  avatarIcon,
  avatarProps,
  address,
  balance,
}) {
  return (
    <Card elevation={1} sx={{ borderRadius: 10, padding: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", marginBottom: 2 }}>
          <Avatar sx={avatarProps}>{avatarIcon}</Avatar>
          <Box sx={{ flexGrow: 1 }} />
          <ChipAvatar address={address} />
        </Box>
        <Box>
          <Typography variant="subtitle1" component="div">
            Ethereum
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bolder" }}
          >
            {balance} ETH
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}