import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy API Gateway path — send users to Partners of GEI. */
export const Route = createFileRoute("/_authenticated/integrations")({
  beforeLoad: () => {
    throw redirect({ to: "/partners" });
  },
});
