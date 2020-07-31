import axios from "axios";
import Papa from "papaparse";

const _proxyurl = "https://cors-anywhere.herokuapp.com/";
const _basicHeaders = {
  "Content-Type": "text/csv",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
};

const getNationalData = async () => {
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv`;
  const res = await axios.get(_proxyurl + url, {
    headers: _basicHeaders
  });
  return Papa.parse(res.data, {
    header: true
  });
};

const getCasesByRegion = async () => {
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_datos_isciii_nueva_serie.csv`;
  const res = await axios.get(_proxyurl + url, {
    headers: _basicHeaders
  });

  return Papa.parse(res.data, {
    header: true
  });
};

const getDeathsByRegion = async () => {
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_fallecidos.csv`;
  const res = await axios.get(_proxyurl + url, {
    headers: _basicHeaders
  });

  return Papa.parse(res.data, {
    header: true
  });
};

const getHospitalizedByRegion = async () => {
  const url = `https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_hospitalizados.csv`;
  const res = await axios.get(_proxyurl + url, {
    headers: _basicHeaders
  });

  return Papa.parse(res.data, {
    header: true
  });
};

export {
  getCasesByRegion,
  getDeathsByRegion,
  getHospitalizedByRegion,
  getNationalData
};