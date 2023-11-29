import * as chains from "viem/chains";

export const chain =
  chains[process.env.NEXT_PUBLIC_CHAIN as keyof typeof chains];

export const blockExplorer =
  "blockExplorers" in chain ? chain.blockExplorers.default.url : undefined;
