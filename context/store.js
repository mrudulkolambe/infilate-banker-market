import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase_config";
import { useAuthContext } from "./Auth";


const CampaignUpload = createContext();

export function CampaignUploadProvider({ children }) {
	const { user } = useAuthContext()
	const [campaignData, setCampaignData] = useState();

	useEffect(() => {
		console.log(user)
		const q = query(collection(db, "campaign_data"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const data = [];
			querySnapshot.forEach((doc) => {
				let obj = doc.data()
				obj.id = doc.id
				data.push(obj)
			});
			setCampaignData(data)
		});
		return () => {
			unsubscribe()
		}
	}, [user]);


	return (
		<CampaignUpload.Provider value={{ campaignData }}>
			{children}
		</CampaignUpload.Provider>
	);
}

export function useCampaignUpload() {
	return useContext(CampaignUpload);
}
