import type { AccountData, ChartData } from "../types";

export const accountData: AccountData = {
  "182616478020197825": {
    id: "182616478020197825",
    current_balance: 15272.19,
    name: "Melanie's Checking",
    subtype: "checking",
    type: "depository"
  },
  "182616478054800834": {
    id: "182616478054800834",
    current_balance: 50428.32,
    name: "Joint Savings",
    subtype: "savings",
    type: "depository"
  },
  "182616478096743875": {
    id: "182616478096743875",
    current_balance: -2621.39,
    name: "Joint Credit Card",
    subtype: "credit_card",
    type: "credit"
  },
  "182616478134492612": {
    id: "182616478134492612",
    current_balance: 180707.72,
    name: "Jon's 401k",
    subtype: "st_401k",
    type: "brokerage"
  },
  "182616478165949893": {
    id: "182616478165949893",
    current_balance: 150912.46,
    name: "Melanie's 401k",
    subtype: "st_401k",
    type: "brokerage"
  },
  "182616478214184390": {
    id: "182616478214184390",
    current_balance: 200862.92,
    name: "Melanie's IRA",
    subtype: "ira",
    type: "brokerage"
  },
  "182616478263467463": {
    id: "182616478263467463",
    current_balance: 10635.8,
    name: "Brokerage",
    subtype: "brokerage",
    type: "brokerage"
  },
  "182616478315896264": {
    id: "182616478315896264",
    current_balance: 300090.9,
    name: "Home",
    subtype: "primary_home",
    type: "real_estate"
  },
  "182616478354693577": {
    id: "182616478354693577",
    current_balance: -239133.1,
    name: "Mortgage",
    subtype: "mortgage",
    type: "loan"
  },
  "182616478368325066": {
    id: "182616478368325066",
    current_balance: 20614.07,
    name: "Honda CR-V",
    subtype: "car",
    type: "vehicle"
  }
};

export const chartData: ChartData = {
  "182616478020197825": [
    { balance: 15272.19, date: "2023-07-12" },
    { balance: 15199.51, date: "2023-07-11" },
    { balance: 15383.38, date: "2023-07-10" }
  ],
  "182616478054800834": [
    { balance: 50308.68, date: "2024-07-12" },
    { balance: 50135.57, date: "2024-07-11" },
    { balance: 50341.4, date: "2024-07-10" }
  ],
  "182616478096743875": [
    { balance: -3430.21, date: "2023-07-12" },
    { balance: -3430.21, date: "2023-07-11" },
    { balance: -3430.21, date: "2023-07-10" }
  ]
};
