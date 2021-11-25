import React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import EthereumIcon from "../../components/EthereumIcon";
import Page from "../../components/Page";
import TrustedCard from "./TrustedCard";
import TrustsLists from "./TrustsLists";
import WalletCard from "./WalletCard";

import { useAppContext } from "../../state/hooks";
import { useBeneficiary, useTestator } from "../../hooks/useTrustee";
import { useWeb3 } from "../../hooks/useWeb3";
import { shortenAddress } from "../../utils/format";

export default function Home() {
  const {
    balance,
    chainId,
    currentAccount,
    checkInDeadline,
    checkInFrequencyInDays,
    balanceInTrusts,
    trusts,
    setBalance,
    setShowTab
  } = useAppContext();
  const { fetchBalance } = useWeb3();
  const { fetchBeneficiaryTrusts } = useBeneficiary();
  const {
    fetchProfile,
    fetchTrusts,
    updateCheckInDeadline,
    updateCheckInFrequencyInDays,
  } = useTestator();

  React.useEffect(() => {
    if (currentAccount) {
      fetchProfile();
      fetchTrusts();
      fetchBeneficiaryTrusts();
      fetchBalance(currentAccount, setBalance);
      // reset tab view
      setShowTab(0);
    }
  }, [currentAccount, chainId, balanceInTrusts, balance]);

  return (
    <Page>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Welcome {trusts.length ? ` back, ` : null}
            <>
              <Typography variant="subtitle1" component="span" color="primary">
                {shortenAddress(currentAccount)}
              </Typography>
              !
            </>
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bolder" }}
          >
            Onyx Trust Wallet
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <WalletCard
            avatarIcon={<EthereumIcon color="white" />}
            avatarProps={{
              width: 64,
              height: 64,
              padding: 1,
              backgroundColor: "#00AB55",
            }}
            address={currentAccount}
            balance={balance}
            updateCheckInFrequencyInDays={updateCheckInFrequencyInDays}
            isTestator={trusts.length}
          />
        </Grid>
        <Grid item xs={12} sm={6} hidden={!trusts.length}>
          <TrustedCard
            avatarIcon={<SecurityOutlinedIcon sx={{ fontSize: 35 }} />}
            avatarProps={{
              width: 56,
              height: 56,
              backgroundColor: "#007B55",
              color: "#FFFFFF",
              padding: 1,
            }}
            title="Total Trusts Balance"
            subheader={`${balanceInTrusts} ETH`}
          />
        </Grid>
        <Grid item xs={12} sm={6} hidden={!trusts.length}>
          <TrustedCard
            avatarIcon={<VerifiedUserOutlinedIcon sx={{ fontSize: 35 }} />}
            avatarProps={{
              width: 56,
              height: 56,
              backgroundColor: "#007B55",
              color: "#FFFFFF",
              padding: 1,
            }}
            title="Trusts Locked Until"
            subheader={`${new Date(checkInDeadline).toDateString()}`}
            action={
              <Box sx={{ textAlign: "right" }}>
                <IconButton onClick={updateCheckInDeadline}>
                  <UpdateOutlinedIcon color="warning" />
                </IconButton>
                <Typography variant="caption" component="div">
                  +{checkInFrequencyInDays} days
                </Typography>
              </Box>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TrustsLists />
        </Grid>
      </Grid>
    </Page>
  );
}
