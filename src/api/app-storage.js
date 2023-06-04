import { Storage } from "appwrite";
import { client } from "./app-client";

const storage = new Storage(client);

export { storage };
