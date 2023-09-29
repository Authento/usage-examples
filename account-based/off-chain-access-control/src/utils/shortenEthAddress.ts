/**
 * Shortens an ethereum address to the format 0x000000…0000
 * @param address Full address
 * @returns Shortened address
 */
export const shortenEthAddress = (address: `0x${string}`) => {
  const match = address.match(/^(.{8}).+(.{4})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
