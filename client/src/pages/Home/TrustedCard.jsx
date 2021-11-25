import React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

export default function TrustedCard({
  avatarIcon,
  avatarProps,
  title,
  subheader,
  action,
  ...props
}) {
  return (
    <Card elevation={1} sx={{ borderRadius: 8, padding: 1 }} {...props}>
      <CardHeader
        avatar={<Avatar sx={avatarProps}>{avatarIcon}</Avatar>}
        title={<Typography variant="subtitle1">{title}</Typography>}
        subheader={
          <Typography variant="body1" sx={{ fontWeight: "bolder" }}>
            {subheader}
          </Typography>
        }
        action={action}
      />
    </Card>
  );
}
