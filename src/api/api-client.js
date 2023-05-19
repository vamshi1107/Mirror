import axios from "axios";
import { AppParams } from "../services/params";

export const client = axios.create({
  baseURL: AppParams.server,
});
