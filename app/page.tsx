"use client";
import AppWrapper from "./components/AppWrapper";
import MainComponent from "./components/MainComponent";
import NameGetter from "./components/NameGetter";
import { ThemeProvider } from "./components/ThemeProvider";
import ReduxProvider from "./redux/Provider";

export default function Home() {
	return (
		<ReduxProvider>
			<AppWrapper>
				<NameGetter>
					<ThemeProvider>
						<MainComponent />
					</ThemeProvider>
				</NameGetter>
			</AppWrapper>
		</ReduxProvider>
	);
}
