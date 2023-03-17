import MenuWidget from "@/components/MenuWidget";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/models/user";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type CreateListForm = {
	title: string;
	menuUrl: string;
	partyMembers: string[];
	description: string;
};

const MyLists = () => {
	const methods = useForm<CreateListForm>({ mode: "onBlur" });
	const { user, logOut } = useAuth();
	const router = useRouter();
	const [characterCount, setCharacterCount] = useState<number>(0);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = methods;

	if (!user) {
		router.replace("/login");
	}

	const handleLogout = async () => {
		try {
			await logOut();
			console.log("user logged out");
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmit = async (data: CreateListForm) => {
		console.log(data);
	};

	return (
		<>
			<div className="w-full flex flex-row justify-center gap-3 items-center p-3">
				<button
					onClick={() => router.push("/")}
					className="p-3 text-light bg-dark"
				>
					Home
				</button>
				<button className="p-3 text-light bg-dark border-b border-light">
					My lists
				</button>
				<button onClick={() => router.push("/profile")} className="p-3 text-light bg-dark">Profile</button>
			</div>
			{/* desktop */}
			<div className="w-full flex flex-col justify-center items-center gap-3 p-12">
				<div className="w-full max-w-[1280px] flex justify-start items-center text-light text-3xl font-medium py-3 border-b border-light">
					Start new meal
				</div>
				<FormProvider {...methods}>
					<form className="w-full flex justify-center items-center">
						<div className="w-full max-w-[1280px] flex flex-col justify-center items-center bg-light rounded-lg p-4 gap-3">
							<div className="w-full text-left text-dark text-2xl font-normal border-b border-dark">
								Meal title
							</div>
							<div className="w-full flex-grow rounded-lg mt-4">
								<input
									type="text"
									className="block w-full rounded-lg p-4 sm:text-sm bg-dark h-[50px] outline-none text-light"
									placeholder="Title"
									{...register("title", {
										required: "Title is required",
									})}
								/>
								{errors.title && (
									<p className="text-red-400">
										{errors.title.message}
									</p>
								)}
							</div>
							<div className="w-full text-left text-dark text-2xl font-normal border-b border-dark">
								Menu url
							</div>
							<div className="w-full flex-grow rounded-lg mt-4">
								<input
									type="text"
									className="block w-full rounded-lg p-4 sm:text-sm bg-dark h-[50px] outline-none text-light"
									placeholder="Link"
									{...register("menuUrl", {
										required: "Link is required",
									})}
								/>
								{errors.menuUrl && (
									<p className="text-red-400">
										{errors.menuUrl.message}
									</p>
								)}
							</div>
							<div className="w-full text-left text-dark text-2xl font-normal border-b border-dark">
								Invite party members
							</div>
							<div className="w-full text-left text-dark text-2xl font-normal border-b border-dark">
								Meal description
							</div>
							<div className="w-full flex-grow rounded-lg mt-4">
								<textarea
									id="message"
									rows={4}
									className="block w-full rounded p-4 text-light sm:text-sm bg-dark outline-none"
									placeholder="Let the people know!"
									{...register("description")}
									maxLength={1500}
									onChange={(e) =>
										setCharacterCount(e.target.value.length)
									}
								/>
								<div className="w-full text-right text-dark text-sm">
									{characterCount}/1500
								</div>
								{errors.description && (
									<p className="text-red-400">
										{errors.description.message}
									</p>
								)}
							</div>
						</div>
					</form>
				</FormProvider>
				<div className="w-full max-w-[1280px] flex justify-start items-center text-light text-3xl font-medium py-3 border-b border-light">
					Meals
				</div>
				<div className="hidden md:grid w-full max-w-[1280px] xl:grid-cols-3 md:grid-cols-2 grid-flow-row gap-3 my-4">
					<MenuWidget
						title={"Por que no order"}
						date={"02.22.23"}
						users={["Paetin, Stella, Rya, Rebecca"]}
						mealType={3}
						orders_complete={false}
					/>
					<MenuWidget
						title={"Por que no order"}
						date={"02.22.23"}
						users={["Paetin, Stella, Rya, Rebecca"]}
						mealType={3}
						orders_complete={true}
					/>
					<MenuWidget
						title={"Por que no order"}
						date={"02.22.23"}
						users={["Paetin, Stella, Rya, Rebecca"]}
						mealType={3}
						orders_complete={true}
					/>
				</div>
			</div>

			{/* mobile */}
			<div className="md:hidden w-full flex flex-col justify-center items-center gap-3">
				<MenuWidget
					title={"Por que no order"}
					date={"02.22.23"}
					users={["Paetin, Stella, Rya, Rebecca"]}
					mealType={3}
					orders_complete={false}
				/>
				<MenuWidget
					title={"Por que no order"}
					date={"02.22.23"}
					users={["Paetin, Stella, Rya, Rebecca"]}
					mealType={3}
					orders_complete={true}
				/>
				<MenuWidget
					title={"Por que no order"}
					date={"02.22.23"}
					users={["Paetin, Stella, Rya, Rebecca"]}
					mealType={3}
					orders_complete={true}
				/>
			</div>
			<div className="w-full flex justify-end items-center">
				<button
					onClick={() => handleLogout()}
					className="p-3 bg-red-600 rounded-lg text-white"
				>
					Log out
				</button>
			</div>
		</>
	);
};

export default MyLists;
