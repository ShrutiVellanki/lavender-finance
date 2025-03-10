import { accountData, chartData } from "./test-data";

const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://your-heroku-app-endpoint.com/api/data";

// add a fetch call wrapper to handle errors
export const fetchWrapper = async (
  url: string | URL | Request,
  options?: RequestInit | undefined,
) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchChartData = async () => {
  // return await fetchWrapper(`${corsProxyUrl}${"https://monarch-ch-ts1-584627ff4d57.herokuapp.com/snapshots"}`);
  return chartData;
};

export const fetchAccountData = async () => {
  // return await fetchWrapper(`${corsProxyUrl}https://monarch-ch-ts1-584627ff4d57.herokuapp.com/accounts`);
  return accountData;
};
