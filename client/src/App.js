import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";
// import routes from "./routes";

import Beneficiaries from "./pages/Beneficiaries";
import Landing from "./pages/Landing";

import { useAppContext, useEventOnLoad } from "./state/hooks";
import {useContractGlobals} from "./hooks/useTrustee";

function App() {
  useEventOnLoad();
  useContractGlobals();
  const { isConnected, showPage } = useAppContext();

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
