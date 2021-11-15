import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<>...</>}>
        <Home />
      </Suspense>
    ),
  },
];

export default routes;
