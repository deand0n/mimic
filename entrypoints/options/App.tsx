import type { JSX } from "solid-js";

export type AppProps = {
	children?: JSX.Element;
};
export const App = (props: AppProps) => {
	return (
		<div class="container h-dvh m-auto py-10 caret-primary">
			{props.children}
		</div>
	);
};
