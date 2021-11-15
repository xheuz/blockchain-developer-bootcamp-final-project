import React, { useState, useEffect } from "react";
import TrusteeContract from "./contracts/Trustee.json";
import getWeb3 from "./utils/getWeb3";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import routes from "./routes";

function App() {
  // const [state, setState] = useState({
  //   storageValue: 0,
  //   web3: null,
  //   accounts: null,
  //   contract: null,
  // });

  // useEffect(() => {
  //   async function a () => {
  //     try {
  //       // Get network provider and web3 instance.
  //       const web3 = await getWeb3();

  //       // Use web3 to get the user's accounts.
  //       const accounts = await web3.eth.getAccounts();

  //       // Get the contract instance.
  //       const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = TrusteeContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         TrusteeContract.abi,
  //         deployedNetwork && deployedNetwork.address
  //       );
  //       // Set web3, accounts, and contract to the state, and then proceed with an
  //       // example of interacting with the contract's methods.
  //       this.setState({ web3, accounts, contract: instance }, this.runExample);
  //     } catch (error) {
  //       // Catch any errors for any of the above operations.
  //       alert(
  //         `Failed to load web3, accounts, or contract. Check console for details.`
  //       );
  //       console.error(error);
  //     }
  //   }
  // }, [state.web3]);

  // const { accounts, contract } = state;
  // console.log(accounts, contract);

  // Stores a given value, 5 by default.
  // const response = await contract.methods.testatorsCount().call();
  // console.log(response);

  // Get the value from the contract to prove it worked.
  // const response = await contract.methods.get().call();

  // Update state with the result.
  // this.setState({ storageValue: response });

  // if (!state.web3)
  //   return <div>Loading Web3, accounts, and contract...</div>;
  return (
    <Router>
      <TopBar />
      <main>
        <Routes>
          {routes.map(({ path, element: C }, index) => (
            <Route key={index} path={path} element={C} />
          ))}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
