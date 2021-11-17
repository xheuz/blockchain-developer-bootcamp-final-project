import { lazy, Suspense } from "react";

const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const Beneficiaries = lazy(() => import("./pages/Beneficiaries"));

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
        <Beneficiaries />
      </Suspense>
    ),
  },
];

export default routes;
