import type { JSX } from "solid-js";
import { type KeyDownHandler, keyDownListener } from "./key-listener";

export type EditKeyboardNavigationProps = {
	children: JSX.Element;
};
export const EditKeyboardNavigation = (props: EditKeyboardNavigationProps) => {
	const resolved = children(() => props.children);

	const keyMap = new Map<string, KeyDownHandler>([
		[
			"KeyS",
			() => {
				if (document.activeElement !== document.body) return;
				// @ts-ignore
				resolved()?.querySelector(".__key-save")?.click();
			},
		],
		[
			"KeyD",
			() => {
				if (document.activeElement !== document.body) return;
				// @ts-ignore
				resolved()?.querySelector(".__key-delete")?.click();
			},
		],
		[
			"KeyB",
			() => {
				if (document.activeElement !== document.body) return;
				// @ts-ignore
				resolved()?.querySelector(".__key-back")?.click();
			},
		],
		[
			"Escape",
			() => {
				// @ts-ignore
				document.activeElement?.blur();
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
