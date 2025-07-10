import type { JSX } from "solid-js";
import { type KeyDownHandler, keyDownListener } from "./key-listener";

export type HomeKeyboardNavigationProps = {
	children: JSX.Element;
};
export const HomeKeyboardNavigation = (props: HomeKeyboardNavigationProps) => {
	const resolved = children(() => props.children);
	const keyMap = new Map<string, KeyDownHandler>([
		[
			"KeyA",
			() => {
				// @ts-ignore
				resolved()?.querySelector(".__key-create")?.click();
			},
		],
	]);

	const callback = (event: KeyboardEvent) => {
		keyDownListener(event, keyMap);
	};
	onMount(() => {
		document.addEventListener("keydown", callback);
	});
	onCleanup(() => {
		document.removeEventListener("keydown", callback);
	});

	return <>{resolved()}</>;
};
