import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  update,
  remove,
  push,
  orderByChild,
  equalTo,
  query,
} from "firebase/database";
import { firebaseConfig } from "./config";

export const firebase = initializeApp(firebaseConfig);
export const db = getDatabase(firebase);
export const auth = getAuth();
export const GoogleProvider = new GoogleAuthProvider();
export const dbRef = ref(getDatabase());
GoogleProvider.setCustomParameters({ prompt: "select_account" });

export const handleUserProfile = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const { uid, displayName, email, photoURL } = userAuth;

  const { creationTime } = userAuth.metadata;
  const userRoles = "teacher";
  const status = "active";
  await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    if (!snapshot.exists()) {
      try {
        set(ref(db, `users/${uid}`), {
          displayName,
          email,
          photoURL,
          creationTime,
          userRoles,
          status,
          ...additionalData,
        });
      } catch (error) {
        console.log(error);
      }
    } else if (snapshot.child("photoURL").val() === null) {
      try {
        update(ref(db, `users/${uid}`), {
          photoURL,
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

  const userRef = get(child(dbRef, `users/${uid}`));

  return userRef;
};

export const googleHandleUserProfile = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const { uid, photoURL } = userAuth;
  let exist = false;
  let userRef = 0;
  await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    if (!snapshot.exists()) {
      exist = false;
    } else if (snapshot.child("photoURL").val() === null) {
      exist = true;
      try {
        update(ref(db, `users/${uid}`), {
          photoURL,
        });
      } catch (error) {
        console.log(error);
      }
    } else exist = true;
  });
  if (exist) {
    userRef = get(child(dbRef, `users/${uid}`));
  }

  return userRef;
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};

export const addPost = async (path, data) => {
  try {
    const newPostKey = push(child(ref(db), "posts")).key;
    await set(ref(db, path + newPostKey), data);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (path, oldData, newData) => {
  try {
    await update(ref(db, path + oldData.id), newData);
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (path, uid) => {
  try {
    await remove(ref(db, path + uid));
  } catch (error) {
    console.log(error);
  }
};

export const readPost = async (path) => {
  const fetchedResults = [];
  try {
    await get(child(dbRef, `${path}`)).then((snapshot) => {
      let rawData = snapshot.val();
      for (let key in rawData) {
        fetchedResults.unshift({
          ...rawData[key],
          id: key,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  return fetchedResults;
};

export const readPostAxios = async (path, child, equal) => {
  const fetchedResults = [];
  try {
    let que = query(ref(db, `${path}`), orderByChild(child), equalTo(equal));
    await get(que).then((snapshot) => {
      snapshot.forEach((childSnapShot) => {
        let rawData = childSnapShot.val();
        rawData["id"] = childSnapShot.key;
        fetchedResults.push(rawData);
      });
    });
  } catch (error) {
    console.log(error);
  }
  return fetchedResults;
};
export const readPostKey = async (path) => {
  const fetchedResults = [];
  try {
    await get(child(dbRef, `${path}`)).then((snapshot) => {
      snapshot.forEach((childSnapShot) => {
        fetchedResults.push(childSnapShot.key);
      });
    });
  } catch (error) {
    console.log(error);
  }

  return fetchedResults;
};
