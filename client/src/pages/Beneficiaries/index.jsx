import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import Button from "../../components/Button";
import Page from "../../components/Page";
import Dialog from "../../components/Dialog";

import BeneficiaryItem from "./BeneficiaryItem";
import BeneficiaryForm from "./BeneficiaryForm";
import BeneficiaryDetails from "./BeneficiaryDetails";

import { useAppContext } from "../../state/hooks";
import { useTestator } from "../../hooks/useTrustee";

export default function Beneficiaries() {
  const {
    currentAccount,
    beneficiaries,
    showAddBeneficiaryDialog,
    setShowAddBeneficiaryDialog,
    showViewBeneficiaryDialog,
    setShowViewBeneficiaryDialog,
  } = useAppContext();
  const { fetchBeneficiaries } = useTestator();

  React.useEffect(() => {
    if (currentAccount) fetchBeneficiaries();
  }, [currentAccount]);

  const handleCloseDetails = () => {
    setShowViewBeneficiaryDialog(false);
  };

  const handleCloseForm = () => {
    setShowAddBeneficiaryDialog(false);
  };

  return (
    <Page
      title={"Beneficiaries"}
      helpText={"People You Care About"}
      actionRight={
        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={() => setShowAddBeneficiaryDialog(true)}
        >
          New Beneficiary
        </Button>
      }
    >
      {beneficiaries.length === 0 ? (
        <Box>You don't have beneficiaries yet.</Box>
      ) : null}
      <Dialog open={showViewBeneficiaryDialog} handleClose={handleCloseDetails}>
        <BeneficiaryDetails />
      </Dialog>
      <Dialog open={showAddBeneficiaryDialog} handleClose={handleCloseForm}>
        <BeneficiaryForm />
      </Dialog>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {beneficiaries.map((beneficiary, index) => (
          <Grid item xs={12} sm={12} md={6} key={index}>
            <BeneficiaryItem beneficiary={beneficiary} />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}
