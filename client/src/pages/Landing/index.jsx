import React from "react";
import Box from "@mui/material/Box";

import HeroSection from "./HeroSection";
// import InfoSection from "./InfoSection";
// import CounterSection from "./CountersSection";

export default function Landing() {
  return (
    <Box sx={{paddingTop: 2}}>
      <HeroSection />
      {/* <InfoSection />
      <CounterSection /> */}
    </Box>
  );
}
