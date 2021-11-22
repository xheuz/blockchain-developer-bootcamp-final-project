import { lazy, Suspense } from "react";
import BeneficiaryContextProvider from "./state/beneficiaries";

export const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
export const Beneficiaries = lazy(() => import("./pages/Beneficiaries"));

const routes = [
  {
    path: "/landing",
    element: (
      <Suspense fallback={<>...</>}>
        <Landing />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<>...</>}>
        <BeneficiaryContextProvider>
          <Beneficiaries />
        </BeneficiaryContextProvider>
      </Suspense>
    ),
  },
];

export default routes;
