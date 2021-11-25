import React from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import EthereumIcon from "../../components/EthereumIcon";
import Page from "../../components/Page";
import TrustedCard from "./TrustedCard";
import TrustsDetailsCard from "./TrustsDetailsCard";
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
    beneficiaryTrusts,
    setBalance,
  } = useAppContext();
  const { fetchBalance } = useWeb3();
  const { fetchBeneficiaryTrusts, claimTrust } = useBeneficiary();
  const {
    fetchProfile,
    fetchTrusts,
    createTrust,
    cancelTrust,
    updateCheckInDeadline,
    updateCheckInFrequencyInDays,
  } = useTestator();

  React.useEffect(() => {
    if (currentAccount) {
      fetchProfile();
      fetchTrusts();
      fetchBeneficiaryTrusts();
      fetchBalance(currentAccount, setBalance);
    }
  }, [currentAccount, chainId, balanceInTrusts, balance]);

  return (
    <Page>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Welcome {trusts.length ? "back!" : "to"}
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
            }}
            address={currentAccount}
            balance={balance}
          />
        </Grid>
        <Grid item xs={12} sm={6} hidden={!trusts.length}>
          <TrustedCard
            avatarIcon={<SecurityOutlinedIcon /*sx={{ fontSize: 35 }}*/ />}
            avatarProps={{
              color: "#FFFFFF",
              padding: 1,
            }}
            title="Total Trusts Balance"
            subheader={`${balanceInTrusts} ETH`}
          />
        </Grid>
        <Grid item xs={12} sm={6} hidden={!trusts.length}>
          <TrustedCard
            avatarIcon={<VerifiedUserOutlinedIcon />}
            avatarProps={{
              color: "#FFFFFF",
              padding: 1,
            }}
            title="Trusts Locked Until"
            subheader={`${new Date(checkInDeadline).toDateString()}`}
            action={
              <IconButton onClick={updateCheckInDeadline}>
                <UpdateOutlinedIcon color="warning" />
              </IconButton>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TrustsDetailsCard
            trusts={trusts}
            beneficiaryTrusts={beneficiaryTrusts}
            createTrust={createTrust}
            cancelTrust={cancelTrust}
            claimTrust={claimTrust}
          />
        </Grid>
      </Grid>
      {/* 
      <h2>Testator</h2>
      <div>
        <button
          onClick={async () =>
            await createTrust("0x27Cc1710aF9637e49c393B23222c883189d5282f", "1")
          }
          >
          createTrust
        </button>
      </div>

      <div>
        <button onClick={async () => await cancelTrust(0)}>cancelTrust</button>
      </div>

      <div>
        <button onClick={updateCheckInDeadline}>updateCheckInDeadline</button>
      </div>

      <div>
        <button onClick={() => updateCheckInFrequencyInDays(60)}>
          updateCheckInFrequencyInDays
        </button>
      </div>

      <div>
        <button onClick={fetchProfile}>fetchProfile</button>
        <p>checkInDeadline: {checkInDeadline}</p>
        <p>checkInFrequencyInDays: {checkInFrequencyInDays}</p>
        <p>balanceInTrusts: {balanceInTrusts}</p>
      </div>

      <div>
        <button onClick={fetchTrusts}>fetchBeneficiaryTrusts</button>
        {trusts.map((t, indx) => (
          <div key={indx}>
            <div>{t.id}</div>
            <div>{TrustState[t.state]}</div>
            <div>{t.balance}</div>
            <div>{t.testator}</div>
            <div>{t.timestamp}</div>
          </div>
        ))}
      </div>

      <h2>Beneficiary</h2>
      <div>
        <button onClick={fetchBeneficiaryTrusts}>fetchBeneficiaryTrusts</button>
        {beneficiaryTrusts.map((t, indx) => (
          <div key={indx}>
            <div>{t.id}</div>
            <div>{TrustState[t.state]}</div>
            <div>{t.balance}</div>
            <div>{t.testator}</div>
            <div>{t.timestamp}</div>
          </div>
        ))}
      </div> */}
    </Page>
  );
}
