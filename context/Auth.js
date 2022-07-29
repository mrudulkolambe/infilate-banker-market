import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, sendEmailVerification, ActionCodeOperation } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase_config";
import { useRouter } from "next/router";
import { collection, doc, getDocs, increment, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";


const AuthContext = createContext();

export function AuthContextProvider({ children }) {
	const [user, setUser] = useState()
	const [userData, setUserData] = useState()
	const router = useRouter()
	const [alert, setAlert] = useState('')
	const [POC, setPOC] = useState()
	const [filter, setFilter] = useState('')

	const handleSignOut = () => {
		signOut(auth).then(() => {
			setUser()
			router.push('/')
		}).catch((error) => {
			// An error happened.
		});
	}

	const handleSignIn = async (email, password) => {
		signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user;
				if (user.emailVerified) {
					setUser(user)
					router.push('/main')
				} else {
					setAlert('Verification Email sent to your email! Also check your spam folder')
				}
			})
			.catch((error) => {
				console.log(error.message)
				setAlert(error.message)
			});
	}


	useEffect(() => {
		if (user) {
			let userData = user
			const unsub = onSnapshot(doc(db, "publisher_database", user.uid), (doc) => {
				userData.phone = doc.data().phone
				userData.kyc = doc.data().kyc
				userData.aadhaar = doc.data().aadhaar
				userData.pan = doc.data().pan
				userData.banker = doc.data().banker
				userData.appliedBanker = doc.data().appliedBanker
				userData.trackingURLs = doc.data().trackingURLs
				userData.advertiserHold = doc.data().advertiserHold
				userData.advertiserHoldData = doc.data().advertiserHoldData
				userData.holdData = doc.data().holdData
				userData.hold = doc.data().hold
				userData.requested_withdrawal = doc.data().requested_withdrawal
				userData.ready_for_withdrawal = doc.data().ready_for_withdrawal
				setUserData(doc.data())
			});
			setUser(userData)
		}
	}, [user]);

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				const unsub = onSnapshot(doc(db, "publisher_database", user.uid), (doc) => {
					user.phone = doc.data().phone
					user.kyc = doc.data().kyc
					user.aadhaar = doc.data().aadhaar
					user.pan = doc.data().pan
					user.banker = doc.data().banker
					user.appliedBanker = doc.data().appliedBanker
					user.trackingURLs = doc.data().trackingURLs
					user.advertiserHold = doc.data().advertiserHold
					user.advertiserHoldData = doc.data().advertiserHoldData
					user.hold = doc.data().hold
					user.requested_withdrawal = doc.data().requested_withdrawal
					user.ready_for_withdrawal = doc.data().ready_for_withdrawal
					setUserData(doc.data())
				});
				const unsub1 = onSnapshot(doc(db, 'POC', 'POC'), (doc) => {
					setPOC(doc.data())
				})
				if (router.pathname === '/') {
					router.push('/main')
				}
			}
			else {
				router.push('/')
			}
		});
	}, []);

	const handleSignUp = (email, password, name, phone) => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				updateProfile(user, {
					displayName: name,
					phoneNumber: phone.toString()
				}).then(async () => {
					await setDoc(doc(db, "publisher_database", user.uid), { username: name, email: user.email, uid: user.uid, phone: phone, kyc: 'Pending', banker: false, appliedBanker: false, photoURL: '', requested_withdrawal: false })
				}).catch((error) => {
					console.log(error)
				});
			})
			.catch((error) => {
				setAlert(error.message)
			});
	}

	useEffect(() => {
		if (alert.length !== 0) {
			setTimeout(() => {
				setAlert('')
			}, 3000);
		}
	}, [alert]);

	return (
		<AuthContext.Provider value={{ auth, handleSignIn, user, handleSignOut, handleSignUp, alert, setAlert, setUser, POC, userData, filter, setFilter }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}
