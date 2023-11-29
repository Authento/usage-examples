import { blockExplorer } from "src/constants/blockExplorer";

interface TxSuccessProps {
  txHash: `0x${string}`;
}

const TxSuccess = ({ txHash }: TxSuccessProps) => {
  return blockExplorer ? (
    <a
      className="tx-success"
      href={`${blockExplorer}/tx/${txHash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Success! View transaction
    </a>
  ) : (
    <span className="tx-success">{`Success! TxHash: ${txHash}`}</span>
  );
};

export default TxSuccess;
