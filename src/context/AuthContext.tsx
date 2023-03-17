import react, { createContext, useContext, useEffect, useState } from "react";
import {
	onAuthStateChanged,
	onIdTokenChanged,
	createUserWithEmailAndPassword,
	UserCredential,
	signInWithEmailAndPassword,
	signOut,
	getIdToken,
} from "firebase/auth";
import {
	collection,
	setDoc,
	doc,
	CollectionReference,
	DocumentData,
} from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import axios from "axios";

interface UserType {
	email: string | null;
	uid: string | null;
}

const AuthContext = createContext({});

export default AuthContext;

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [user, setUser] = useState<UserType | null>({
		email: null,
		uid: null,
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [idToken, setIdToken] = useState<string | null>();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser({
					email: user.email,
					uid: user.uid,
				});
			} else {
				setUser(null);
			}
		});
		setLoading(false);

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (user) => {
			if (!user) {
				setUser(null);
				setIdToken(null);
			} else {
				const token = await user.getIdToken();
				setUser(user);
				setIdToken(token);
			}
		});
		return () => unsubscribe();
	}, []);

	const signUp = async (
		email: string,
		password: string,
		name: string
	): Promise<void> => {
		try {
			console.log(name);
			const res = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const newUser = res.user;

			const docRef = await setDoc(doc(firestore, "users", newUser.uid), {
				uid: newUser.uid,
				name: name,
				email: newUser.email,
			});


			await axios.post(
				"http://localhost:3001/user/create",
				{
					firstName: name,
					uid: newUser.uid,
					email: newUser.email,
					isActive: true,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	const logIn = async (
		email: string,
		password: string
	): Promise<UserCredential> => {
		return await signInWithEmailAndPassword(auth, email, password);
	};

	const logOut = async () => {
		setUser(null);
		await signOut(auth);
	};

	const getToken = async (cred: UserCredential) => {
		const token = await getIdToken(cred.user);
		return token;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				getToken,
				logOut,
				signUp,
				logIn,
			}}
		>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};
