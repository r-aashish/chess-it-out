/**
 * formatDate function formats a timestamp into a human-readable date string.
 * @param timestamp - The timestamp to format (in seconds).
 * @returns A string representing the formatted date.
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

/**
 * calculateWinLossRatio function calculates the win/loss ratio.
 * @param wins - The number of wins.
 * @param losses - The number of losses.
 * @returns A string representing the win/loss ratio, formatted to two decimal places.
 */
export const calculateWinLossRatio = (wins: number, losses: number): string => {
  if (losses === 0) {
    return wins.toString();
  }
  const ratio = wins / losses;
  return ratio.toFixed(2);
};
