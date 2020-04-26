export const calculateTrend = (present, past) => {
  return (((present - past) * 100) / present).toFixed(1);
};

export const getColor = d => {
  return d > 10
    ? "#990000"
    : d > 5.5
    ? "#d7301f"
    : d > 4.5
    ? "#ef6548"
    : d > 3.5
    ? "#fc8d59"
    : d > 2.5
    ? "#fdbb84"
    : d > 1.5
    ? "#fdd49e"
    : d > 1
    ? "#fee8c8"
    : "#fff7ec";
};
