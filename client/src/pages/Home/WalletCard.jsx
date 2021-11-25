import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import ChipAvatar from "../../components/ChipAvatar";
import TrustUpdateFrequencyForm from "./TrustUpdateFrequencyForm";

const styles = {
  card: { borderRadius: 10, padding: 2 },
  cardAvatar: { display: "flex", marginBottom: 2 },
  cardBody: { display: "flex", marginBottom: 0 },
  formTriggerButton: { textAlign: "right", cursor: "pointer" },
};

export default function WalletCard({
  avatarIcon,
  avatarProps,
  address,
  balance,
  isTestator,
}) {
  return (
    <Card elevation={1} sx={styles.card}>
      <CardContent>
        <Stack spacing={1}>
          <Box sx={styles.cardAvatar}>
            <Avatar sx={avatarProps}>{avatarIcon}</Avatar>
            <Box sx={{ flexGrow: 1 }} />
            <ChipAvatar address={address} />
          </Box>
          <Box sx={styles.cardBody}>
            <div>
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
            </div>
            <Box sx={{ flexGrow: 1 }} />
            {isTestator ? (
              <Box sx={{ alignSelf: "flex-end" }}>
                <TrustUpdateFrequencyForm
                  triggerButton={
                    <Box sx={styles.formTriggerButton}>
                      <IconButton>
                        <SettingsOutlinedIcon />
                      </IconButton>
                      <Typography variant="caption" component="div">
                        change check-in frequency
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            ) : null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
