import axios from "axios";
import Papa from "papaparse";
const _basicHeaders = {
  "Content-Type": "text/csv",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
};

const getNationalData = async () => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv`;
  const res = await axios.get(proxyurl + url, {
    headers: _basicHeaders,
  });
  return Papa.parse(res.data, { header: true });
};

const getCasesByRegion = async () => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_casos.csv`;
  const res = await axios.get(proxyurl + url, {
    headers: _basicHeaders,
  });

  return Papa.parse(res.data, { header: true });
};

export { getCasesByRegion, getNationalData };
