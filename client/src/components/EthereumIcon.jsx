import React from "react";
import { ReactComponent as EthereumOriginalIcon } from "../assets/ethereum.svg";
import { ReactComponent as EthereumBlackIcon } from "../assets/ethereumBlack.svg";
import { ReactComponent as EthereumGreenIcon } from "../assets/ethereumGreen.svg";
import { ReactComponent as EthereumBlueIcon } from "../assets/ethereumBlue.svg";
import { ReactComponent as EthereumWhiteIcon } from "../assets/ethereumWhite.svg";

// original logo taken from:
// https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg
export default function EthereumIcon({ color = "default" }) {
  if (color === "primary") return <EthereumGreenIcon />;
  if (color === "secondary") return <EthereumBlueIcon />;
  if (color === "black") return <EthereumBlackIcon />;
  if (color === "white") return <EthereumWhiteIcon />;
  return <EthereumOriginalIcon />;
}
