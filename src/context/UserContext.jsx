import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useHistory } from "react-router-dom";
import {
  auth,
  handleUserProfile,
  googleHandleUserProfile,
  GoogleProvider,
  updatePost,
  readPost,
  //getCurrentUser,
} from "./../firebase/utils.js";

const UserContext = React.createContext();

const INITIAL_STATE = {
  saving: false,
  currentUser: false,
  resetPasswordSuccess: false,
  error: "",
  uid: "",
  creationTime: "",
  photoURL: "",
  userRoles: "",
  displayName: "",
  location: "",
  A: "",
  B: "",
  V: "",
  lessonData: [],
  practiceData: [],
  userData: [],
};

export const UserStore = (props) => {
  const history = useHistory();
  const [state, setState] = useState(INITIAL_STATE);

  const signUpUser = async (displayName, email, password) => {
    setState({ ...state, saving: true });
    try {
      const additionalData = {
        displayName,
      };
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await handleUserProfile(user, additionalData);
      setState({
        ...state,
        saving: false,
        error: "",
      });
    } catch (err) {
      setState({ ...state, saving: false, error: err.message });
    }
  };

  const signInUser = async (email, password) => {
    setState({ ...state, saving: true, error: "" });
    const additionalData = {};
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRef = await handleUserProfile(user, additionalData);
      const users = await getData("users/");
      setState({
        ...state,
        currentUser: true,
        uid: userRef.key,
        error: "",
        userData: users,
        saving: false,
        ...userRef.val(),
      });
    } catch (err) {
      setState({ ...state, saving: false, error: err.message });
    }
  };

  const signOutUser = async () => {
    setState({ ...state, saving: true, error: "" });
    try {
      await auth.signOut();
      setState(INITIAL_STATE);
    } catch (err) {
      setState({ ...state, saving: false, error: err.message });
    }
  };

  const handleResetPasswordAPI = async (email) => {
    const config = {
      url: "http://localhost:3000/login",
    };
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(auth, email, config)
        .then(() => {
          resolve();
        })
        .catch(() => {
          const err = {
            code: 400,
            message: "Email not found. Please try again.",
          };
          reject(err);
        });
    });
  };

  const resetPassword = async (email) => {
    setState({ ...state, saving: true, error: "" });
    try {
      await handleResetPasswordAPI(email);
      setState({
        ...state,
        saving: false,
        resetPasswordSuccess: true,
        error: "",
      });
    } catch (err) {
      setState({ ...state, saving: false, error: err.message });
    }
  };

  const updateData = async (oldData, data) => {
    setState({ ...state, saving: true });
    try {
      await updatePost("users/", oldData, data);
    } catch (err) {
      setState({
        ...state,
        saving: false,
        error: err.message,
      });
      return err.message;
    }
  };

  const getData = async (path) => {
    setState({ ...state, saving: true });
    try {
      const fetchData = await readPost(path);
      if (path === "users/") {
        setState({
          ...state,
          userData: fetchData,
        });
      }
      if (path === "curriculums/lesson/") {
        setState({
          ...state,
          lessonData: fetchData,
        });
      }
      if (path === "curriculums/practice/") {
        setState({
          ...state,
          practiceData: fetchData,
        });
      }
      setState({
        ...state,
        saving: false,
        error: "",
      });
      return fetchData;
    } catch (err) {
      setState({
        ...state,
        saving: false,
        error: err.message,
      });
      return err.message;
    }
  };

  return (
    <UserContext.Provider
      value={{
        state,
        signUpUser,
        signInUser,
        signOutUser,
        resetPassword,
        getData,
        updateData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
