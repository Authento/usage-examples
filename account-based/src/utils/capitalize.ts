/**
 * Capitalizes the input string
 * @param string String to be capitalized
 * @returns Capitalized string
 */
export const capitalize = (string: string | null | undefined) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
