export const calculateTrend = (present, past) => {
  return (((present - past) * 100) / present).toFixed(1);
};
