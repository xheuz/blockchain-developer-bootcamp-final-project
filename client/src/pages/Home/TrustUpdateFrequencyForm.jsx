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
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

import { useAppContext } from "../../state/hooks";
import { useTestator } from "../../hooks/useTrustee";

export default function TrustUpdateFrequencyForm({ triggerButton }) {
  const [frequency, setFrequency] = React.useState({ days: 30 });
  const { updateCheckInFrequencyInDays } = useTestator();
  const {
    showUpdateTrustForm,
    setShowUpdateTrustForm,
    checkInFrequencyInDays,
    isButtonDisabled,
    setIsButtonDisabled,
  } = useAppContext();

  const handleOnChange = (event) => {
    setFrequency({
      ...frequency,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickOpen = () => {
    setShowUpdateTrustForm(true);
  };

  const handleClose = () => {
    setShowUpdateTrustForm(false);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    await updateCheckInFrequencyInDays(frequency.days);
    setIsButtonDisabled(false);
    handleClose();
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{triggerButton}</div>
      <Dialog open={showUpdateTrustForm} onClose={handleClose}>
        <DialogTitle>
          <Typography
            variant="h3"
            component="div"
            sx={{ fontWeight: "bolder" }}
            textAlign="center"
          >
            Check-In Frequency
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ fontWeight: "bolder" }}
            textAlign="center"
          >
            currently: {checkInFrequencyInDays} days
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
              type="number"
              fullWidth
              autoFocus
              margin="dense"
              id="days"
              name="days"
              label="Days"
              value={frequency.days}
              onChange={handleOnChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <UpdateOutlinedIcon color="warning" />
                  </InputAdornment>
                ),
              }}
              helperText="How often do you want to check-in? (minimum every 30 days)."
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
