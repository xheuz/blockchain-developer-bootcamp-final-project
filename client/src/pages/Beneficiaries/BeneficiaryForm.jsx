import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Page from "../../components/Page";
import TextField from "@mui/material/TextField";

import { useAppContext } from "../../state/hooks";
import { useTestator } from "../../hooks/useTrustee";

const inputFields = [
  {
    id: "outlined-first-name",
    label: "First Name",
    name: "firstname",
    helperText:
      "Beneficiary FirstName. (This information is not send to the blockchain)",
    grid: {
      xs: 12,
      md: 6,
    },
  },
  {
    id: "outlined-last-name",
    label: "Last Name",
    name: "lastname",
    helperText:
      "Beneficiary LastName. (This information is not send to the blockchain)",
    grid: {
      xs: 12,
      md: 6,
    },
  },
  {
    i: "outlined-address",
    label: "Address",
    name: "address",
    helperText: "Ethereum public address",
    grid: {
      xs: 12,
      md: 12,
    },
  },
];

export default function BeneficiaryAdd() {
  // TODO: Add input validations
  // TODO: Add error handling
  const { setShowAddBeneficiaryDialog } = useAppContext();
  const { createBeneficiary, fetchBeneficiaries } = useTestator();
  const [beneficiary, setBeneficiary] = React.useState({
    firstname: "",
    lastname: "",
    address: "",
  });

  const handleOnChange = (e) => {
    setBeneficiary({
      ...beneficiary,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      // const payload = {
      //   name: beneficiary.firstname + " " + beneficiary.lastname,
      //   address: beneficiary.address,
      //   date: new Date().toISOString(),
      //   trustAddress: mockAddress(),
      // };
      createBeneficiary(beneficiary.address);
      fetchBeneficiaries();
      setShowAddBeneficiaryDialog(false);
    } catch {}
  };

  return (
    <Page title={"Add Beneficiary"} helpText={"Required Information"}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleOnSubmit}
      >
        <Grid container spacing={2}>
          {inputFields.map((i, index) => (
            <Grid item {...i.grid} key={index}>
              <TextField {...i} fullWidth required onChange={handleOnChange} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="reset" variant="outlined">
                Clear
              </Button>
              <Box sx={{ m: 1 }}></Box>
              <Button type="submit" color="primary" variant="contained">
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}
