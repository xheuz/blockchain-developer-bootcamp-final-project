import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function BeneficiaryItem({
  name,
  date,
  address,
  trustAddress,
  handleOpenDetails,
  handleSelected,
}) {
  const handleOnClick = () => {
    handleOpenDetails();
    handleSelected({ name, date, address, trustAddress });
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
          action={
            <IconButton color="primary">
              <InfoOutlinedIcon />
            </IconButton>
          }
          title={
            <Typography variant="subtitle1" component="div">
              {name}
            </Typography>
          }
          subheader={
            <Typography variant="caption" component="div">
              {date}
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
