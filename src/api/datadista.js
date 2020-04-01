import axios from "axios";

const _basicHeaders = {
  "Content-Type": "text/csv",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
};

const getCases = async () => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_casos.csv`;
  const res = await axios.get(proxyurl + url, {
    headers: _basicHeaders
  });
  return res.data;
};

export { getCases };
