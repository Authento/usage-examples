"use client";

import { ReactNode } from "react";
import { CosmosProvider as Provider } from "authento-react";

const CosmosProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export default CosmosProvider;
