import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { iexec } from "../chains";

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLECT_CONNECT_PROJECT_ID as string;

// 2. Create wagmiConfig
const metadata = {
    name: "Hello scone",
    description: "protect your data and use it inside enclave",
    url: "https://comingsoon.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [iexec];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export function Web3Modal({ children }: { children: React.ReactNode }) {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
