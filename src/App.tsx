import Home from "./views/Home";
import { getDefaultConnectors, KitProvider } from "@0xsequence/kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, polygon, Chain } from "wagmi/chains";
import "@0xsequence/design-system/styles.css";

const queryClient = new QueryClient();

const App = () => {
  const chains = [mainnet, polygon] as [Chain, ...Chain[]];

  // Get your own project access key on sequence.build
  const projectAccessKey = import.meta.env.VITE_KIT_ACCESS_KEY;

  const connectors = getDefaultConnectors('universal', {
    walletConnectProjectId: "wallet-connect-id",
    defaultChainId: 137,
    appName: "demo app",
    projectAccessKey,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transports: { [key: number]: any } = {};

  chains.forEach((chain) => {
    transports[chain.id] = http();
  });

  const config = createConfig({
    transports,
    connectors,
    chains,
  });

  const kitConfig = {
    projectAccessKey,
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <KitProvider config={kitConfig}>
          <Home />
        </KitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
