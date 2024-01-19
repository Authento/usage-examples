interface ConnectPanelProps {
  handleEthConnect: () => void;
  handleCosmosConnect: () => void;
}

export const ConnectPanel = ({
  handleEthConnect,
  handleCosmosConnect,
}: ConnectPanelProps) => (
  <>
    <button className="primary-btn" onClick={handleEthConnect}>
      Connect Ethereum Wallet
    </button>
    <button className="primary-btn" onClick={handleCosmosConnect}>
      Connect Cosmos Wallet
    </button>
  </>
);
