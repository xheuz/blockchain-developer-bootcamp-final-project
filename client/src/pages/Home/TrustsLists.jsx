import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import TrustAddForm from "./TrustAddForm";
import TrustItem from "./TrustItem";

import { useAppContext } from "../../state/hooks";
import { useBeneficiary, useTestator } from "../../hooks/useTrustee";

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#5BE584",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(20),
    marginRight: theme.spacing(5),
    padding: theme.spacing(4),
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-selected": {
      color: "#FFF",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
    "&.MuiButtonBase-root": {
      height: "10px",
    },
  })
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, position: "relative" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TrustList({ trusts, action, isTestator }) {
  return (
    <Grid container spacing={2}>
      {trusts.map((t, indx) => (
        <Grid item xs={12} sm={6} key={indx}>
          <TrustItem trust={t} action={action} isTestator={isTestator} />
        </Grid>
      ))}
      {isTestator ? (
        <Grid item xs={12} sm={6} key={"add"}>
          <TrustAddForm triggerButton={<TrustItem addNew={true} />} />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default function TrustsLists() {
  const { trusts, beneficiaryTrusts, showTab, setShowTab } = useAppContext();
  const { cancelTrust } = useTestator();
  const { claimTrust } = useBeneficiary();

  const handleChange = (event, newValue) => {
    setShowTab(newValue);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  return (
    <>
      <StyledTabs
        value={showTab}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
      >
        <StyledTab
          label="Trusts"
          {...a11yProps(0)}
          icon={
            <Badge badgeContent={trusts.length} color="primary">
              <ShieldOutlinedIcon color="action" />
            </Badge>
          }
          iconPosition="end"
        />
        <StyledTab
          label="Claim"
          {...a11yProps(1)}
          icon={
            <Badge badgeContent={beneficiaryTrusts.length} color="primary">
              <GppMaybeOutlinedIcon color="action" />
            </Badge>
          }
          iconPosition="end"
          disabled={beneficiaryTrusts.length === 0}
        />
      </StyledTabs>
      <div>
        <div>
          <TabPanel value={showTab} index={0}>
            <TrustList trusts={trusts} action={cancelTrust} isTestator={true} />
          </TabPanel>
          <TabPanel value={showTab} index={1}>
            <TrustList trusts={beneficiaryTrusts} action={claimTrust} />
          </TabPanel>
        </div>
      </div>
    </>
  );
}
