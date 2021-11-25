import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RemoveModeratorOutlinedIcon from "@mui/icons-material/RemoveModeratorOutlined";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";

import Gavatar from "../../components/Gavatar";

import { useAppContext } from "../../state/hooks";
import { shortenAddress, timestampToDate } from "../../utils/format";
import { TrustState } from "../../constants";

const styles = {
  global: {
    backgroundColor: "#00AB55",
    color: "#FFFFFF",
  },
  card: {
    new: { borderRadius: 8, borderStyle: "dashed", borderColor: "#00AB55" },
    newContent: { flexGrow: 1, color: "white", padding: 1 },
    status: {
      flexGrow: 1,
      backgroundColor: "#00AB55",
      color: "white",
      padding: 1,
    },
  },
};

export default function TrustItem({ trust, action, isTestator, addNew }) {
  const { web3 } = useAppContext();

  if (addNew) {
    return (
      <Card elevation={2} sx={styles.card.new}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar aria-label="beneficiary" sx={styles.global}>
                <AddModeratorOutlinedIcon />
              </Avatar>
            }
            title="Beneficiary Address"
            subheader="Eth Balance"
          />
          <CardContent sx={styles.card.newContent}>
            <Typography variant="h6" component="div" textAlign="center">
              Add Trust
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  const isPending = Number(trust.state) === 0;
  const gavatarAddress = isTestator ? trust.beneficiary : trust.testator;

  return (
    <Card elevation={2} sx={{ borderRadius: 8 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="trust">
            <Gavatar hash={gavatarAddress} />
          </Avatar>
        }
        action={
          isTestator ? (
            <Box sx={{ textAlign: "right" }}>
              <IconButton
                onClick={isPending ? () => action(trust.id) : null}
                disabled={!isPending}
              >
                <RemoveModeratorOutlinedIcon
                  color={isPending ? "error" : "default"}
                />
              </IconButton>
              <Typography variant="caption" component="div">
                {timestampToDate(trust.timestamp)}
              </Typography>
            </Box>
          ) : (
            <IconButton onClick={() => action(trust.id)}>
              <HealthAndSafetyOutlinedIcon color="success" />
            </IconButton>
          )
        }
        title={
          <Typography variant="subtitle1" component="div">
            {shortenAddress(gavatarAddress)}
          </Typography>
        }
        subheader={
          <Typography variant="subtitle1" component="div">
            {web3.utils.fromWei(trust.balance, "ether")} ETH
          </Typography>
        }
      />
      <Box sx={styles.card.status}>
        <Typography variant="caption" component="div" textAlign="center">
          {TrustState[trust.state].toLowerCase()}
        </Typography>
      </Box>
    </Card>
  );
}
