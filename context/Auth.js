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
	const [totalAmount, setTotalAmount] = useState(0)
	const [advertiserHoldAmount, setAdvertiserHoldAmount] = useState(0)
	const [applyForValidationData, setApplyForValidationData] = useState()
	const [alert, setAlert] = useState('')
	const [POC, setPOC] = useState()
	const [withdrawalAmount, setWithdrawalAmount] = useState(0)
	const [advertiserHoldData, setAdvertiserHoldData] = useState()
	const [holdData, setHoldData] = useState()

	const handleSignOut = () => {
		signOut(auth).then(() => {
			console.log('first')
			setUser()
			router.push('/')
		}).catch((error) => {
			// An error happened.
		});
	}
	const getTimeData = () => {
		let dateOBJ = new Date()
		let day = dateOBJ.getDate();
		let month = dateOBJ.getMonth() + 1;
		let year = dateOBJ.getFullYear();
		if (day <= 9) {
			day = `0${day}`
		}
		if (month <= 9) {
			month = `0${month}`
		}
		let dateString1 = `${day}-${month}-${year}`
		return dateString1
	}

	const handleSignIn = async (email, password) => {
		signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user;
				if (user.emailVerified) {
					setUser(user)
					router.push('/main')
				} else {
					// router.push('/verification')
					setAlert('Verification Email sent to your email! Also check your spam folder')
				}
			})
			.catch((error) => {
				console.log(error.message)
				setAlert(error.message)
			});
	}

	// useEffect(() => {
	// 	if (user && user.emailVerified) {
	// 		manageData(user)
	// 	}
	// }, [user]);

	const manageData = async (user) => {
		const q = query(collection(db, "campaign_details"), where("publisher_id", "==", user.uid), where('ready_for_withdrawal', '>', 0), where('completed_withdrawal', '==', false));
		const querySnapshot = await getDocs(q)
		const arr = [];
		let finalAmount = 0
		querySnapshot.forEach(async (document) => {
			let obj = document.data()
			obj.id = document.id
			arr.push(obj);
			finalAmount += document.data().ready_for_withdrawal
			console.log(document.data())
			arr.push(document.data())
		})
		arr && arr.forEach(async (data) => {
			let docRef = doc(db, "campaign_details", data.id);
			await updateDoc(docRef, {
				completed_withdrawal: true,
			})
			let docRef2 = doc(db, 'publisher_database', user.uid)
			console.log(data.ready_for_withdrawal)
			await updateDoc(docRef2, {
				advertiserAmount: 0,
				applied_for_verification: false,
				withdraw_data: arr,
				withdrawal_amount: increment(data && data.ready_for_withdrawal)
			})
		})
		setWithdrawalAmount(finalAmount)
		setApplyForValidationData(arr)
		const docRef = doc(db, "publisher_database", user.uid);
		if (finalAmount !== 0) {
			setWithdrawalAmount(finalAmount)
		} else {
			const unsub = onSnapshot(doc(db, "publisher_database", user.uid), (document) => {
				setAdvertiserHoldAmount(document.data().advertiserAmount)
				setWithdrawalAmount(document.data().withdrawal_amount)
			});
		}
	}

	useEffect(() => {
		if (user) {
			console.log(user)
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
		handleAdvertiserData()
	}, [advertiserHoldData]);

	const handleAdvertiserData = async () => {
		advertiserHoldData && advertiserHoldData.forEach(async (document) => {
			const docRef = doc(db, "campaign_details", document.id);
			const docRef1 = doc(db, "publisher_database", document.publisher_id);

			await updateDoc(docRef, {
				advertiser_hold_completed: true
			});
			await updateDoc(docRef1, {
				advertiserHold: increment(document.revenue),
				hold: increment(-document.revenue),
				advertiserHoldData: advertiserHoldData
			})
		})
		setAdvertiserHoldData()
	}


	const handleHoldData = async () => {
		holdData && holdData.forEach(async (document) => {
			const docRef = doc(db, "campaign_details", document.id);
			const docRef1 = doc(db, "publisher_database", document.publisher_id);

			await updateDoc(docRef, {
				hold_completed: true
			});
			await updateDoc(docRef1, {
				hold: increment(document.revenue),
			})
		})
		setHoldData()
		// let dateOBJ = new Date()
		// let date = dateOBJ.getDate()
		// let month = dateOBJ.getMonth()
		// let year = dateOBJ.getFullYear()

	}

	useEffect(() => {
		if (user) {
			handleHoldData()
		}
	}, [holdData, user]);

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				if (user.emailVerified) {
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
					setUser(user)
					setUserData(user)
					const unsub1 = onSnapshot(doc(db, 'POC', 'POC'), (doc) => {
						setPOC(doc.data())
					})
					//  
					let dateOBJ = new Date()
					const q1 = query(collection(db, "campaign_details"), where("publisher_id", "==", user.uid), where('hold_completed', '==', false));
					const querySnapshot1 = await getDocs(q1);
					let arr1 = [];
					let newDateObj = new Date()
					console.log(Date.now())
					querySnapshot1.forEach(async (document, i) => {
						console.log(document.data().advertiser_timestamp, newDateObj.getTime(), document.data().campaign_name)
						let obj = document.data()
						obj.id = document.id
						arr1.push(obj);
					});
					setHoldData(arr1)

					const q2 = query(collection(db, "campaign_details"), where("publisher_id", "==", user && user.uid), where('advertiser_hold_completed', '==', false), where('advertiser_timestamp', '<=', Date.now()));
					const querySnapshot2 = await getDocs(q2);
					let arr2 = [];
					querySnapshot2.forEach(async (document, i) => {
						let obj = document.data()
						obj.id = document.id
						arr2.push(obj);
					});
					setAdvertiserHoldData(arr2)

					if (!user) {
						if (router.pathname === '/' || router.pathname.includes('store') || router.pathname.includes(`banker-market/`)) {
							return
						}
						else {
							router.push('/')
						}
					}
				}
				else {
					sendEmailVerification(user)
						.then(() => {
							setAlert('Verification Email sent to your email! Also check your spam folder')
						});
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
				console.log(user)
				updateProfile(user, {
					displayName: name,
					phoneNumber: phone.toString()
				}).then(async () => {
					console.log(user)
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
		<AuthContext.Provider value={{ auth, handleSignIn, user, handleSignOut, handleSignUp, alert, setAlert, totalAmount, setTotalAmount, advertiserHoldAmount, setUser, applyForValidationData, withdrawalAmount, setWithdrawalAmount, POC, userData, holdData, advertiserHoldData }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}
