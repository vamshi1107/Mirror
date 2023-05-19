import { account } from "../api/app-accounts";
import { database } from "../api/app-database";
import { AppParams } from "./params";
import { v4 as ID } from "uuid";

export const addUser = async (user) => {
  try {
    const res = await account.create(
      user.username,
      user.email,
      user.password,
      user.name
    );
    if (res) {
      saveUser({ ...user });
    }
    return res;
  } catch (err) {
    console.log(err.message);
    return { error: true, errmsg: err.message };
  }
};

export const saveUser = async (user) => {
  try {
    const res = database.createDocument(
      AppParams.databaseID,
      AppParams.usersCollectionID,
      ID(),
      user
    );
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};

export const loginUser = async (email, pass) => {
  try {
    const res = await account.createEmailSession(email, pass);
    return res;
  } catch (err) {
    console.log(err);
    return { error: true, errmsg: err.message };
  }
};

export const getUserInfo = async () => {
  try {
    const res = await account.get();
    return res;
  } catch (err) {
    console.log(err);
    return { error: true, errmsg: err.message };
  }
};

export const logoutUser = async () => {
  try {
    const res = await account.deleteSession("current");
    return res;
  } catch (err) {
    console.log(err);
    return { error: true, errmsg: err.message };
  }
};
