export const calculateTrend = (present, past) => {
  return (((present - past) * 100) / present).toFixed(1);
};

export const getDailyStats = (today, yesterday) => {
  return {
    diff: today - yesterday,
    trend: calculateTrend(today, yesterday)
  };
};
