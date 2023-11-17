import { defineChain } from "viem";

export const iexec = defineChain({
    id: 134,
    name: "iExec Sidechain",
    network: "iexec",
    nativeCurrency: {
        decimals: 18,
        name: "xRLC",
        symbol: "xRLC",
    },
    rpcUrls: {
        default: {
            http: ["https://bellecour.iex.ec"],
        },
        public: {
            http: ["https://bellecour.iex.ec"],
        },
    },
    blockExplorers: {
        default: {
            name: "BlockScout",
            url: "https://blockscout-bellecour.iex.ec/",
        },
    },
    testnet: false,
});
