import { Databases } from "appwrite";
import { client } from "./app-client";

const database = new Databases(client);

export { database };
