import axios from "axios";

export default axios.create({
  baseURL: "http://content-player-web3.azurewebsites.net/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  },
});
