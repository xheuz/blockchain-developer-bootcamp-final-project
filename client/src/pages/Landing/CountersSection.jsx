import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Section from "../../components/Section";
import { useAppContext } from "../../state/hooks";

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
  const { totalTestators, totalBeneficiaries, totalBalanceTrusted } = useAppContext();
  const counters = [
    {
      name: "Testators",
      count: totalTestators,
    },
    {
      name: "Beneficiaries",
      count: totalBeneficiaries,
    },
    {
      name: "Balance",
      count: totalBalanceTrusted,
    },
  ];

  return (
    <Section sx={{ padding: 2, flexGrow: 1}}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        {counters.map((e, index) => (
          <CounterBox {...e} key={index} />
        ))}
      </Stack>
    </Section>
  );
}
