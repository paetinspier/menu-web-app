import { useAuth } from "@/context/AuthContext";
import { Inter } from "@next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const router = useRouter();
	const { user } = useAuth();

	return (
		<>
			<div className="w-full flex flex-row justify-center gap-3 items-center p-3">
				<button className="p-3 text-light bg-dark border-b border-light">
					Home
				</button>
				{user ? (
					<div className="flex flex-row justify-center items-center gap-3">
						<button
							onClick={() => router.push("/myLists")}
							className="p-3 text-light bg-dark"
						>
							My lists
						</button>
						<button onClick={() => router.push("/profile")} className="p-3 text-light bg-dark">
							Profile
						</button>
					</div>
				) : (
					<div className="flex flex-row justify-center items-center gap-3">
						<button
							onClick={() => router.push("/signUp")}
							className="p-3 text-light bg-dark"
						>
							Sign up
						</button>
						<button
							onClick={() => router.push("/login")}
							className="p-3 text-light bg-dark"
						>
							Log in
						</button>
					</div>
				)}
			</div>
			<div className="w-full min-h-[90vh] flex flex-col justify-center items-center px-3">
				<div className="w-full max-w-[1000px] flex flex-col justify-center items-center">
					<div className="w-full flex flex-col justify-center items-center rounded-md p-8 gap-4">
						<div className="w-full text-left text-light text-9xl font-medium">
							Menu
						</div>
						<div className="w-full text-left text-light text-7xl font-light">
							Get your take away order sorted
						</div>
					</div>

					<div className="w-full flex flex-col justify-center items-center rounded-md p-8 gap-3 bg-light mt-20">
						<div className="w-full flex flex-row justify-center items-center">
							<div className="text-dark text-5xl">
								How to menu
							</div>
						</div>
						<div className="w-full flex flex-row justify-start items-center">
							<div className="w-2/12 text-dark text-3xl">
								Step 1
							</div>
							<div className="w-full h-4 whitespace-nowrap border-b border-dotted border-dark"/>
						</div>
						<div className="w-full flex flex-row italic justify-start items-center px-3 text-dark font-light">
							Create an account using your name, email, and a password.
						</div>
						<div className="w-full flex flex-row justify-start items-center">
							<div className="w-2/12 text-dark text-3xl">
								Step 2
							</div>
							<div className="w-full h-4 whitespace-nowrap border-b border-dotted border-dark"/>
						</div>
						<div className="w-full flex flex-row italic justify-start items-center px-3 text-dark font-light">
							Create create a takout order with a link to the restaurants menu and invite your people.
						</div>
						<div className="w-full flex flex-row justify-start items-center">
							<div className="w-2/12 text-dark text-3xl">
								Step 3
							</div>
							<div className="w-full h-4 whitespace-nowrap border-b border-dotted border-dark"/>
						</div>
						<div className="w-full flex flex-row italic justify-start items-center px-3 text-dark font-light">
							We'll let you know when everyone in your group has submitted their order and you can place your order.
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
