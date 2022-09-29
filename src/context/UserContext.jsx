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

  const signUpUser = async (
    displayName,
    email,
    password,
    selectedDep,
    selectedLevel,
    selectedPosition,
    selectedDegree,
    selectedAcadDegree
  ) => {
    setState({ ...state, saving: true });
    let A = 0,
      B = 0,
      V = 0;
    switch (selectedLevel) {
      case "Цагийн багш":
        A = 0;
        B = 0;
        V = 0;
        break;
      case "Дадлагажигч багш":
        A = 15;
        B = 3;
        V = 7;
        break;
      case "Багш":
        A = 18;
        B = 4;
        V = 3;
        break;
      case "Ахлах багш":
        A = 16;
        B = 6;
        V = 3;
        break;
      case "Дэд профессор":
        A = 14;
        B = 7;
        V = 4;
        break;
      case "Профессор":
        A = 12;
        B = 9;
        V = 4;
        break;
      default:
        setState({ ...state, error: "Invalid Level" });
    }

    try {
      const additionalData = {
        displayName,
        selectedDep,
        selectedLevel,
        selectedPosition,
        selectedDegree,
        selectedAcadDegree,
        A,
        B,
        V,
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
      const system = await getData("system/settings/");
      const curriculum = await getData("curriculums/lesson/");
      const practice = await getData("curriculums/practice/");
      const users = await getData("users/");
      let lessonYear,
        season,
        normLessonYear,
        normSeason,
        resultLock,
        planLock,
        month;

      system.forEach((el) => {
        if (el.name === "selectedLessonYear")
          lessonYear = { value: el.value, id: el.id };
        if (el.name === "selectedNormLessonYear")
          normLessonYear = { value: el.value, id: el.id };
        if (el.name === "selectedSeason")
          season = { value: el.value, id: el.id };
        if (el.name === "selectedNormSeason")
          normSeason = { value: el.value, id: el.id };
        if (el.name === "selectedResultLock")
          resultLock = { value: el.value, id: el.id };
        if (el.name === "selectedPlanLock")
          planLock = { value: el.value, id: el.id };
        if (el.name === "selectedMonth") month = { value: el.value, id: el.id };
      });

      setState({
        ...state,
        currentUser: true,
        uid: userRef.key,
        lessonYear: lessonYear,
        season: season,
        normLessonYear: normLessonYear,
        normSeason: normSeason,
        planLock: planLock,
        resultLock: resultLock,
        month: month,
        error: "",
        lessonData: curriculum,
        practiceData: practice,
        userData: users,
        saving: false,
        ...userRef.val(),
      });
    } catch (err) {
      setState({ ...state, saving: false, error: err.message });
    }
  };

  const googleSignIn = async () => {
    setState({ ...state, saving: true, error: "" });
    try {
      const { user } = await signInWithPopup(auth, GoogleProvider);
      const userRef = await googleHandleUserProfile(user);
      const system = await getData("system/settings/");
      const curriculum = await getData("curriculums/lesson/");
      const practice = await getData("curriculums/practice/");
      const users = await getData("users/");
      let lessonYear, season, resultLock, planLock;

      system.forEach((el) => {
        if (el.name === "selectedLessonYear")
          lessonYear = { value: el.value, id: el.id };
        if (el.name === "selectedSeason")
          season = { value: el.value, id: el.id };
        if (el.name === "selectedResultLock")
          resultLock = { value: el.value, id: el.id };
        if (el.name === "selectedPlanLock")
          planLock = { value: el.value, id: el.id };
      });
      if (userRef === 0) {
        history.push("/404");
        setState({
          ...state,
          currentUser: false,
          saving: false,
        });
      } else {
        setState({
          ...state,
          currentUser: true,
          uid: userRef.key,
          lessonYear: lessonYear,
          season: season,
          planLock: planLock,
          resultLock: resultLock,
          error: "",
          lessonData: curriculum,
          practiceData: practice,
          userData: users,
          saving: false,
          ...userRef.val(),
        });
      }
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

  const onCheckUserSession = async () => {
    return;
    // try {
    //   const userAuth = await getCurrentUser();
    //   if (!userAuth) return;
    //   const userRef = await handleUserProfile(userAuth);
    //   setState({
    //     ...state,
    //     currentUser: true,
    //     uid: userRef.key,

    //     ...userRef.val(),
    //     error: "",
    //   });
    // } catch (err) {
    //   setState({ ...state, error: err.message });
    // }
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
        googleSignIn,
        signOutUser,
        resetPassword,
        onCheckUserSession,
        getData,
        updateData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
