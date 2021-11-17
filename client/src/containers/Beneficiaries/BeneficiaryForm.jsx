import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Page from "../../components/Page";
import TextField from "@mui/material/TextField";
import { mockAddress } from "../../utils/random";

export default function BeneficiaryAdd({ handleAdd }) {
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

  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleAdd({
      name: beneficiary.firstname + " " + beneficiary.lastname,
      address: beneficiary.address,
      date: new Date().toISOString(),
      trustAddress: mockAddress(),
    });
  };

  // destruct beneficiary by its keys
  // const {keyName} = beneficiary

  return (
    <Page title={"Add Beneficiary"} helpText={"Required Information"}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleOnSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-first-name"
              label="First Name"
              name="firstname"
              sx={{ flexGrow: 1 }}
              fullWidth
              required
              // value={keyName}
              helperText="Beneficiary FirstName. (This information is not send to the blockchain)"
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-last-name"
              label="Last Name"
              name="lastname"
              sx={{ flexGrow: 1 }}
              fullWidth
              required
              helperText="Beneficiary LastName. (This information is not send to the blockchain)"
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-address"
              label="Address"
              name="address"
              sx={{ flexGrow: 1 }}
              fullWidth
              required
              helperText="Ethereum public address"
              onChange={handleOnChange}
            />
          </Grid>
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
