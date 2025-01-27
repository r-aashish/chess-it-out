export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

export const calculateWinLossRatio = (wins: number, losses: number): string => {
  if (losses === 0) {
    return wins.toString();
  }
  const ratio = wins / losses;
  return ratio.toFixed(2);
};
