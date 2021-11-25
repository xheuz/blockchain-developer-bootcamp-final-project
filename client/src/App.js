import React from "react";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import CustomizedSnackbars from "./components/SnackBar";

import { useAppContext, useEventOnLoad } from "./state/hooks";

function App() {
  useEventOnLoad();
  const { isConnected } = useAppContext();

  return (
    <main>
      <CustomizedSnackbars />
      {isConnected ? <Home /> : <Landing />}
    </main>
  );
}

export default App;
