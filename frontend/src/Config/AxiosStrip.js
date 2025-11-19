

import axios from "axios";
import { Api_base } from "./Constants"

export const api = axios.create({
  baseURL: Api_base,
  headers: {
    "Content-type": "application/json"
  }
});
 