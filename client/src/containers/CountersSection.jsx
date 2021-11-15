import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Section from "../components/Section";
import Typography from "@mui/material/Typography";

// TODO: replace counters with contract ones to display real numbers
const counters = [
  {
    name: "Testators",
    count: "3,498",
  },
  {
    name: "Beneficiaries",
    count: "17,490",
  },
];

function CounterBox({ name, count }) {
  return (
    <Box
      sx={{
        minWidth: 275,
        flexGrow: 1,
        padding: 3,
        textAlign: "center",
        lineHeight: 3,
        color: "#FFFFFF",
      }}
    >
      <Stack direction="column" spacing={{ xs: 1, sm: 2 }}>
        <Typography variant="h4" component="div" sx={{ marginRight: 1 }}>
          {name}
        </Typography>
        <Typography variant="h3" component="div">
          {count}
        </Typography>
      </Stack>
    </Box>
  );
}
export default function CountersSection() {
  return (
    <Section sx={{ padding: 2, flexGrow: 1, backgroundColor: "#00AB55" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        {counters.map((e, index) => (
          <CounterBox {...e} key={index} />
        ))}
      </Stack>
    </Section>
  );
}
