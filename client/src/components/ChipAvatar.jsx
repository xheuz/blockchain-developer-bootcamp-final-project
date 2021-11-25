import React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import Gavatar from "./Gavatar";

import { shortenAddress } from "../utils/format";

export default function ChipAvatar({ address }) {
  return (
    <Chip
      avatar={
        <Avatar>
          <Gavatar hash={address} />
        </Avatar>
      }
      label={shortenAddress(address)}
      color="primary"
      sx={{ fontWeight: "bold" }}
    />
  );
}
