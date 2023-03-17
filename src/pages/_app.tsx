import { AuthContextProvider } from "@/context/AuthContext";
import { CreateContextProvider } from "@/context/CreateContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthContextProvider>
			<CreateContextProvider>
				<Component {...pageProps} />
			</CreateContextProvider>
		</AuthContextProvider>
	);
}
