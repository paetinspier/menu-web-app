import { firestore } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

interface ProfileChangeForm {
	name: string;
	email: string;
}

const Profile = () => {
	const methods = useForm<ProfileChangeForm>({ mode: "onBlur" });
	const router = useRouter();
	const { user, logOut } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [profileData, setProfileData] = useState<ProfileChangeForm | null>();

	if (!user) {
		router.replace("/login");
	}

	useEffect(() => {
		if (user && user.uid) {
			const docRef = doc(firestore, "users", user.uid);
			const unsub = onSnapshot(docRef, (doc) => {
				const userData: ProfileChangeForm =
					doc.data() as ProfileChangeForm;
				setProfileData(userData);
			});
			console.log(profileData);
		}
	}, [user, loading]);

	const {
		register,
		unregister,
		handleSubmit,
		watch,
		formState: { errors },
	} = methods;

	const nameWatch = watch("name", profileData?.name);

	const submitForm = async (data: ProfileChangeForm) => {
		setLoading(true);
		console.log(data);
		console.log(user.uid);

		try {
			if (data.name != "") {
				const docRef = await updateDoc(
					doc(firestore, "users", user.uid),
					{
						name: data.name,
					}
				);
				unregister("name");
				alert("name changed");
			}
		} catch (error) {
			console.log(error);
			throw error;
		}

		setLoading(false);
	};

	return (
		<>
			<div className="w-full flex flex-row justify-center gap-3 items-center p-3">
				<button
					type="button"
					onClick={() => router.push("/")}
					className="p-3 text-light bg-dark"
				>
					Home
				</button>
				<div className="flex flex-row justify-center items-center gap-3">
					<button
						type="button"
						onClick={() => router.push("/myLists")}
						className="p-3 text-light bg-dark"
					>
						My lists
					</button>
					<button
						type="button"
						className="p-3 text-light bg-dark border-b border-light"
					>
						Profile
					</button>
				</div>
			</div>
			<div className="w-full flex flex-row justify-center items-center mt-20">
				<div className="w-full max-w-[600px] bg-light rounded-lg flex-col justify-center items-center p-5">
					<div className="w-full text-left text-4xl font-bold text-dark">
						My Profile
					</div>
					<FormProvider {...methods}>
						<form
							className="flex flex-col justify-center items-center gap-3"
							onSubmit={handleSubmit(submitForm)}
						>
							<div className="w-full flex flex-col justify-center items-center gap-3">
								<div className="w-full text-left text-dark text-2xl">
									Change name
								</div>
								<input
									type="text"
									placeholder={profileData?.name}
									className="w-full text-light p-3 border border-dark rounded-lg bg-dark my-2"
									{...register("name")}
								/>
								<div className="w-full text-left text-dark text-2xl mt-2">
									Your Email
								</div>
								<div className="w-full text-left text-dark mb-2">
									{profileData?.email}
								</div>
							</div>

							

							<button
								disabled={loading || nameWatch == ''}
								type="submit"
								className="w-full p-3 border border-dark text-dark rounded-lg hover:bg-dark hover:text-light disabled:cursor-not-allowed"
							>
								{loading ? "Wait" : "Save"}
							</button>

                            <button
								type="button"
                                
								className=" text-red-500 border border-red-500 p-3 w-full rounded-lg hover:bg-red-500 hover:text-light"
							>
								Log out
							</button>
						</form>
					</FormProvider>
				</div>
			</div>
		</>
	);
};

export default Profile;
