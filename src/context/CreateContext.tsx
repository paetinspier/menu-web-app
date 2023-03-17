import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";

const CreateContext = createContext({});

export default CreateContext;

export const useCreate = () => useContext<any>(CreateContext);

export const CreateContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [loading, setLoading] = useState<boolean>(false);

	const createMenuList = async (
		title: string,
		menuUrl: string,
		description: string,
        partyMembers: string[],
	) => {
        const map = new Map();
        partyMembers.forEach((value) => {
            map.set(value, "");
        })
        let partyMembersMapObject = Object.fromEntries(map)


		try {
			const docRef = await addDoc(collection(firestore, "menuLists"), {
                title: title,
                menuUrl: menuUrl,
                description: description,
                orders: partyMembersMapObject,
            });
			console.log("Document written with ID: ", docRef.id);

            const docRef2 = await updateDoc(docRef, {
                menuLists: arrayUnion(docRef.id)
            })
		} catch (error) {
            console.log(error)
        }
	};

	return (
		<CreateContext.Provider
			value={{
				createMenuList,
			}}
		>
			{loading ? null : children}
		</CreateContext.Provider>
	);
};
