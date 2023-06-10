import { Query } from "appwrite";
import { account } from "../api/app-accounts";
import { database } from "../api/app-database";
import { AppParams } from "./params";
import { v4 as ID } from "uuid";
import { storage } from "../api/app-storage";

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

export const getUser = async (username) => {
  try {
    const res = await database.listDocuments(
      AppParams.databaseID,
      AppParams.usersCollectionID,
      [Query.equal("username", [username])]
    );
    if (res.total > 0) {
      return res.documents[0];
    }
    return {};
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

export const addProject = async (project) => {
  try {
    const res = database.createDocument(
      AppParams.databaseID,
      AppParams.projectsCollectionID,
      ID(),
      project
    );
    return res;
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};

export const getProjectsByUserId = async (userID) => {
  try {
    const res = database.listDocuments(
      AppParams.databaseID,
      AppParams.projectsCollectionID,
      [Query.equal("user", userID)]
    );
    return res;
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};

export const storeFile = async (file) => {
  try {
    const res = storage.createFile(AppParams.filesBucketID, ID(), file);
    return res;
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};

export const retreiveFile = async (fileId) => {
  try {
    const res = storage.getFile(AppParams.filesBucketID, fileId);
    return res;
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};

export const previewFile = async (fileId) => {
  try {
    const res = storage.getFileView(AppParams.filesBucketID, fileId);
    return res;
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};

export const getDetailsByUserId = async (userID) => {
  try {
    const res = database.listDocuments(
      AppParams.databaseID,
      AppParams.detailsCollectionID,
      [Query.equal("user", userID)]
    );
    return res;
  } catch (err) {
    return { error: true, errmsg: err.message };
  }
};
