import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

const config = {
	apiKey: process.env.VUE_APP_apiKey,
	authDomain: process.env.VUE_APP_authDomain,
	databaseURL: process.env.VUE_APP_databaseURL,
	projectId: process.env.VUE_APP_projectId,
	storageBucket: process.env.VUE_APP_storageBucket,
	messagingSenderId: process.env.VUE_APP_messagingSenderId,
	appId: process.env.VUE_APP_appId,
};

if (!firebase.apps.length) {
	firebase.initializeApp(config);
	firebase.firestore().enablePersistence();
}

export const AUTH = firebase.auth();
export const DB = firebase.firestore();
export const STORAGE = firebase.storage();
export const FUNCTIONS = firebase.functions();
export const FB = firebase;
