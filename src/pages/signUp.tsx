import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

type SignupForm = {
	email: string;
	password: string;
	name: string;
};

const SignupPage = () => {
	const methods = useForm<SignupForm>({ mode: "onBlur" });
	const router = useRouter();

    const { signUp, user } = useAuth();

	if(user){
		router.replace("/myLists")
	}

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = methods;

	const onSubmit = async (data: SignupForm) => {
		console.log(data);

        try {
            const user = await signUp(data.email, data.password, data.name);
            console.log(user);
        }
        catch (error) {
            console.log(error);
        }
	};

	return (
		<>
			<div className="w-full flex flex-row justify-center gap-3 items-center p-3">
				<Link
					href={'/'}
					className="p-3 text-light bg-dark"
				>
					Home
				</Link>
				{/* <button className="p-3 text-light bg-dark border-b border-light">
					Sign up
				</button> */}
				<Link
					href={"/login"}
					className="p-3 text-light bg-dark"
				>
					Log in
				</Link>
			</div>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="w-full min-h-[90vh] flex flex-col justify-center items-center px-3">
						<div className="w-full max-w-[600px] flex flex-col justify-center items-center">
							<div className="w-full flex flex-col justify-center items-center bg-light rounded-md p-8 gap-4">
								<div className="w-full text-left text-dark text-3xl font-medium">
									Sign up
								</div>

								<div className="w-full flex-grow rounded-lg mt-4">
									<input
										type="text"
										className="block w-full rounded-lg px-4 sm:text-sm bg-dark h-[50px] outline-none text-light"
										placeholder="Name"
										{...register("name", {
											required: "Name is required",
										})}
									/>
									{errors.name && (
										<p className="text-red-400">
											{errors.name.message}
										</p>
									)}
								</div>

								<div className="w-full flex-grow rounded-lg mt-4">
									<input
										type="text"
										className="block w-full rounded-lg px-4 sm:text-sm bg-dark h-[50px] outline-none text-light"
										placeholder="Email"
										{...register("email", {
											required: "Email is required",
										})}
									/>
									{errors.email && (
										<p className="text-red-400">
											{errors.email.message}
										</p>
									)}
								</div>

								<div className="w-full flex-grow rounded-lg mt-4">
									<input
										type="password"
										className="block w-full rounded-lg px-4 sm:text-sm bg-dark h-[50px] outline-none text-light"
										placeholder="Password"
										{...register("password", {
											required: "Password is required",
										})}
									/>
									{errors.password && (
										<p className="text-red-400">
											{errors.password.message}
										</p>
									)}
								</div>

								<div className="w-full flex-grow rounded-lg mt-4">
									<button type="submit" className="block w-full rounded-lg px-4 sm:text-sm border-2 border-dark h-[50px] outline-none text-dark">
										Create account
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</>
	);
};

export default SignupPage;
