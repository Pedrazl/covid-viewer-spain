export const calculateTrend = (present, past) => {
  return (((present - past) * 100) / present).toFixed(1);
};

export const getDailyStats = (today, yesterday) => {
  return {
    diff: yesterday - today,
    trend: ((yesterday - today) * 100 / today).toFixed(1)
  };
};
