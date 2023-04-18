import MenuWidget, { MenuList, Message } from "@/components/MenuWidget";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/models/user";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export interface Conversation {
	id: number;
	name: string;
	menu_url: string;
	createdAt: string;
	members: Member[];
}

export interface Member {
	id: number;
	conversation: Conversation;
	user: User;
}

export async function getServerSideProps(context: any) {
	try {
		let result = await axios.get<Conversation[]>(
			`${process.env.NEXT_PUBLIC_API_URL}/conversation/users/${context.query?.userUid}`
		);
		console.log('user uid: ', { data: result.data })
		return { props: { lists: result.data } };
	} catch (err) {
		console.log(err);
		throw err;
	}
}

interface MyListProps {
	lists: Conversation[];
}

type CreateListForm = {
	title: string;
	menuUrl: string;
	partyMembers: string[];
	description: string;
};

const MyLists = (lists: MyListProps) => {
	const methods = useForm<CreateListForm>({ mode: "onBlur" });
	const { logOut, user } = useAuth();
	const router = useRouter();

	const [characterCount, setCharacterCount] = useState<number>(0);
	const [inviteList, setInviteList] = useState<string[]>([]);
	const [currentInvite, setCurrentInvite] = useState<string>("");
	const [isValidInvite, setIsValidInvite] = useState<boolean>(false);


	useEffect(() => {
		if (validateEmail(currentInvite)) {
			setIsValidInvite(true);
		} else {
			setIsValidInvite(false);
		}
	}, [currentInvite]);

	useEffect(() => {
		setValue(
			"partyMembers",
			inviteList
		);
		setCurrentInvite('')
	}, [inviteList])

	const validateEmail = (email: string) => {
		return (
			String(email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				) && !inviteList.includes(email)
		);
	};

	useEffect(() => {
		if (!user) {
			router.replace("/");
		}
	}, [user]);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = methods;

	const onSubmit = async (data: CreateListForm) => {
		console.log({name: data.title, menuUrl: data.menuUrl, members: [...data.partyMembers, user.email]});
		try {
			let result = await axios.post<any>(
				`${process.env.NEXT_PUBLIC_API_URL}/conversation/create`,
				{name: data.title, menuUrl: data.menuUrl, members: [...data.partyMembers, user.email]}
			);
			router.push(`/myLists/${user.uid}`);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<div className="w-full flex flex-row justify-center gap-3 items-center p-3">
				<Link href={"/"} className="p-3 text-light bg-dark">
					Home
				</Link>
				<button className="p-3 text-light bg-dark border-b border-light">
					My lists
				</button>
				<Link href={"/profile"} className="p-3 text-light bg-dark">
					Profile
				</Link>
			</div>
			{/* desktop */}
			<div className="w-full flex flex-col justify-center items-center gap-3 p-12">
				<div className="w-full max-w-[1280px] flex justify-start items-center text-light text-3xl font-medium py-3 border-b border-light">
					Start new meal
				</div>
				<FormProvider {...methods}>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="w-full flex justify-center items-center"
					>
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
							<div className="w-full flex flex-col flex-grow rounded-lg mt-4">
								<div className="w-full flex flex-row justify-start items-center flex-wrap gap-4 mb-3">
									{inviteList.map((invitee, index) => {
										return (
											<>
												<div key={invitee} className="bg-dark px-2 py-1 text-light flex flex-row justify-center items-center gap-1 rounded-md">
													{invitee}
													<button
														type="button"
														onClick={() =>
															setInviteList(
																inviteList.filter(
																	(value) =>
																		invitee !==
																		value
																)
															)
														}
														className="text-red-600"
													>
														x
													</button>
												</div>
											</>
										);
									})}
								</div>

								<div className="w-full flex flex-row justify-center items-center gap-5">
									<input
										type="text"
										className="block w-full rounded-lg p-4 sm:text-sm bg-dark h-[50px] outline-none text-light"
										placeholder="Invitee"
										value={currentInvite}
										onChange={(e) =>
											setCurrentInvite(e.target.value)
										}
									/>
									<button
										disabled={!isValidInvite}
										type="button"
										onClick={() => {
											setInviteList([
												...inviteList,
												currentInvite
											]);
										}}
										className="text-dark hover:text-medium bg-emerald-600 hover:bg-emerald-400 p-3 disabled:bg-transparent rounded-md"
									>
										Invite
									</button>
								</div>
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
							<div className="w-full flex flex-row justify-end items-center">
								<button
									type="submit"
									className="p-3 bg-emerald-600 hover:bg-emerald-400 rounded-md w-full md:w-auto"
								>
									Create meal
								</button>
							</div>
						</div>
					</form>
				</FormProvider>
				<div className="w-full max-w-[1280px] flex justify-start items-center text-light text-3xl font-medium py-3 border-b border-light">
					Orders
				</div>
				<div className="hidden md:grid w-full max-w-[1280px] xl:grid-cols-3 md:grid-cols-2 grid-flow-row gap-3 my-4">
					{lists?.lists?.map((list, index) => {
						return <MenuWidget data={list} />;
					})}
				</div>
			</div>

			{/* mobile */}
			<div className="md:hidden w-full flex flex-col justify-center items-center gap-3">
				{lists?.lists?.map((list, index) => {
					return <MenuWidget data={list} />;
				})}
			</div>
		</>
	);
};

export default MyLists;
