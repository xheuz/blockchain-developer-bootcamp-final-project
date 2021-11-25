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
          <Gavatar hash={`${address}`.toUpperCase()} />
        </Avatar>
      }
      label={shortenAddress(address)}
      color="default"
      sx={{ fontWeight: "bold" }}
    />
  );
}
