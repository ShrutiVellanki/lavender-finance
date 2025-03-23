import { Account, AccountData, ChartData } from "../types";
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

export const fetchAccountData = async (): Promise<AccountData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return accountData;
};

export const fetchChartData = async (): Promise<ChartData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return chartData;
};
