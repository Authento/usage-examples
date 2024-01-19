/**
 * Shortens a cosmos address to the format cosmos000000...0000
 * @param address Full address
 * @returns Shortened address
 */
export const shortenCosmosAddress = (address: string) => {
  const match = address.match(/^(.{12}).+(.{4})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
