// config.js
import { auth, db } from "/firebase-init.js";
import {
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

export { auth, db };
setPersistence(auth, browserLocalPersistence);
