import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAppContext } from "../../state/hooks";
import { useTestator } from "../../hooks/useTrustee";

export default function TrustAddForm({ triggerButton }) {
  const [trust, setTrust] = React.useState({ address: "", amount: 0 });
  const { createTrust } = useTestator();
  const {
    showAddTrustForm,
    setShowAddTrustForm,
    isButtonDisabled,
    setIsButtonDisabled,
    custodyFee,
  } = useAppContext();

  const handleOnChange = (event) => {
    setTrust({
      ...trust,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickOpen = () => {
    setShowAddTrustForm(true);
  };

  const handleClose = () => {
    setShowAddTrustForm(false);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    await createTrust(trust.address, trust.amount);
    setIsButtonDisabled(false);
    handleClose();
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{triggerButton}</div>
      <Dialog open={showAddTrustForm} onClose={handleClose}>
        <DialogTitle>
          <Typography
            variant="h3"
            component="div"
            sx={{ fontWeight: "bolder" }}
            textAlign="center"
          >
            Trust
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              id="address"
              name="address"
              label="Beneficiary Address"
              value={trust.address}
              onChange={handleOnChange}
              helperText="Provide the address of the Beneficiary for ERC20 network."
            />
            <TextField
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              value={trust.amount}
              onChange={handleOnChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ETH</InputAdornment>
                ),
              }}
              type="number"
              fullWidth
              helperText={
                <Typography variant="caption" component="div" sx={{}}>
                  Approximate release fee: {trust.amount * custodyFee} ETH
                </Typography>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isButtonDisabled}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleOnSubmit}
            disabled={isButtonDisabled}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
