import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";
// import routes from "./routes";

import Beneficiaries from "./pages/Beneficiaries";
import Landing from "./pages/Landing";

import { useAppContext, useEventOnLoad } from "./state/hooks";

function App() {
  useEventOnLoad();
  const { web3, contract, isConnected, showPage, chainId, currentAccount } = useAppContext();
  // console.log(web3, contract,chainId, currentAccount);

  // if (!state.web3)
  //   return <div>Loading Web3, accounts, and contract...</div>;
  return (
    <>
      <TopBar />
      {isConnected ? (
        <main>
          {/* <Routes>
          {routes.map(({ path, element: C }, index) => (
            <Route key={index} path={path} element={C} />
          ))}
        </Routes> */}
          {showPage === "fab" ? <Beneficiaries /> : null}
        </main>
      ) : (
        <Landing />
      )}
      {isConnected ? <BottomBar /> : null}
    </>
  );
}

export default App;
