import { useOpenConnectModal } from "@0xsequence/kit";
import { useDisconnect, useAccount } from "wagmi";

import "./Home.css";
import { sequence } from "0xsequence";
import { vote } from "../vote";
import { useEffect, useState } from "react";
import { Card, Text } from "@0xsequence/design-system";
import { Proposal } from "@snapshot-labs/snapshot.js/dist/src/sign/types";
import { Strategy } from "@snapshot-labs/snapshot.js/dist/src/voting/types";

const spaceName = import.meta.env.VITE_SNAPSHOT_SPACE_NAME;

const App = () => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const onClickConnect = () => {
    setOpenConnectModal(true);
  };

  const onClickDisconnect = () => {
    disconnect();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    vote.getProposals(20, 0, "created", "desc").then((r) => {
      setProposals(r.data.proposals);
    });
  });

  const onClickVote = (proposalId: string, choice: number) => {
    const signer = sequence.getWallet().getSigner();
    vote.castVote(
      {
        _signTypedData: signer.signTypedData.bind(signer),
      },
      address!,
      proposalId,
      choice,
    );
  };

  const Connected = () => (
    <>
      <p>Connected with address: {address}</p>
      <div className="card">
        <button onClick={onClickDisconnect}>Disconnect</button>
      </div>
    </>
  );

  const Disconnected = () => (
    <>
      <p>Not connected</p>
      <div className="card">
        <button onClick={onClickConnect}>Connect</button>
      </div>
    </>
  );

  return (
    <div>
      <h1>Sequence Kit Snapshot Boilerplate</h1>
      {isConnected ? <Connected /> : <Disconnected />}
      <h2>
        Proposals for{" "}
        <a href={`https://snapshot.box/#/s:${spaceName}`}>{spaceName}</a>
      </h2>
      {proposals.length > 0
        ? proposals.map(
            (p: Proposal & { id: string; strategies: Strategy[] }, i) => (
              <Card style={{ margin: "10px" }} key={`proposal${i}`}>
                <Text variant="large">{p.title}</Text>
                <br />
                <Text variant="small">{p.body}</Text>
                <br />
                {p.choices.map((c, j: number) => (
                  <button
                    disabled={
                      p.strategies
                        .find((s) => s.name === "whitelist")
                        ?.params?.addresses?.includes(address)
                        ? false
                        : true
                    }
                    key={`proposal${i} choice${j}`}
                    onClick={() => onClickVote(p.id, j + 1)}
                  >
                    {c}
                  </button>
                ))}
              </Card>
            ),
          )
        : "loading..."}
      <footer>
        Want to learn more? Read the{" "}
        <a
          href={
            "https://docs.sequence.xyz/solutions/wallets/sequence-kit/overview/"
          }
          target="_blank"
          rel="noreferrer "
        >
          docs
        </a>
        !
      </footer>
    </div>
  );
};

export default App;
