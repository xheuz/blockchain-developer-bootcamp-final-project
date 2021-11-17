import React from "react";
import Button from "../../components/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import Page from "../../components/Page";
import Dialog from "../../components/Dialog";

import BeneficiaryItem from "./BeneficiaryItem";
import BeneficiaryForm from "./BeneficiaryForm";
import BeneficiaryDetails from "./BeneficiaryDetails";

export default function BeneficiaryView({
  beneficiaries,
  selected,
  handleSelected,
  deleteBeneficiary,
  addBeneficiary
}) {
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleDelete = () => {
    deleteBeneficiary(selected);
    handleCloseDetails();
  };
 
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleAdd = (data) => {
    addBeneficiary(data);
    handleCloseForm();
  }

  return (
    <Page
      title={"Beneficiaries"}
      helpText={"People You Care About"}
      // actionLeft={<TextField size="small" placeholder="Find beneficiary" />}
      actionRight={
        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={handleOpenForm}
        >
          New Beneficiary
        </Button>
      }
    >
      {/* <Box>You don't have beneficiaries yet.</Box> */}
      <Dialog open={openDetails} handleClose={handleCloseDetails}>
        <BeneficiaryDetails selected={selected} handleDelete={handleDelete}/>
      </Dialog>
      <Dialog open={openForm} handleClose={handleCloseForm}>
        <BeneficiaryForm handleAdd={handleAdd}/>
      </Dialog>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {beneficiaries.map((e, index) => (
          <Grid item xs={12} sm={12} md={6} key={index}>
            <BeneficiaryItem
              {...e}
              handleSelected={handleSelected}
              handleOpenDetails={handleOpenDetails}
            />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}
