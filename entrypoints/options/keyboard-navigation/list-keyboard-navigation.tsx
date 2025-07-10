import type { JSX } from "solid-js";
import { type KeyDownHandler, keyDownListener } from "./key-listener";

export type ListKeyboardNavigatorProps = {
	items: unknown[];
	onFocusedIndexChange?: (index: Optional<number>) => void;
	children: JSX.Element;
};

export const ListKeyboardNavigator = (props: ListKeyboardNavigatorProps) => {
	const [focusedElementIndex, setFocusedElementIndex] =
		createSignal<Optional<number>>();

	const resolved = children(() => props.children);
	const listItem = (index: number) =>
		// biome-ignore lint/suspicious/noExplicitAny: important
		(resolved() as any)?.children[index] as HTMLLIElement;

	createEffect(() => {
		props.onFocusedIndexChange?.(focusedElementIndex());
	});

	const keyMap = new Map<string, KeyDownHandler>([
		[
			"KeyJ",
			() => {
				const currentIndex = focusedElementIndex();

				const nextIndex = (currentIndex ?? 1) + 1;
				if (nextIndex >= props.items.length) {
					return;
				}

				listItem(nextIndex).focus();
				setFocusedElementIndex(nextIndex);
			},
		],
		[
			"KeyK",
			() => {
				const currentIndex = focusedElementIndex();

				const nextIndex = (currentIndex ?? 1) - 1;
				if (nextIndex < 0) {
					return;
				}

				listItem(nextIndex).focus();
				setFocusedElementIndex(nextIndex);
			},
		],
		[
			"Escape",
			() => {
				setFocusedElementIndex(undefined);
				// @ts-ignore
				document.activeElement?.blur();
			},
		],
		[
			"KeyE",
			() => {
				const currentIndex = focusedElementIndex();

				if (currentIndex == null) return;
				const el = listItem(currentIndex);

				if (document.activeElement !== el) {
					return;
				}
				el.querySelector<HTMLButtonElement>(".__key-edit")?.click();
				el.focus();
			},
		],
		[
			"KeyP",
			() => {
				const currentIndex = focusedElementIndex();

				if (currentIndex == null) return;
				const el = listItem(currentIndex);

				if (document.activeElement !== el) {
					return;
				}
				el.querySelector<HTMLButtonElement>(".__key-toggle")?.click();
				el.focus();
			},
		],
	]);

	const keyboardListener = (event: KeyboardEvent) => {
		const target = event.target as HTMLElement;

		if (target === document.body || target.classList.contains("list-row")) {
			keyDownListener(event, keyMap);
		}
	};

	const blurHanlder = () => {
		const currentIndex = focusedElementIndex();

		if (currentIndex == null) return;
		const el = listItem(currentIndex);

		if (document.activeElement === el) {
			return;
		}

		setFocusedElementIndex(undefined);
	};

	onMount(() => {
		document.addEventListener("keydown", keyboardListener);
		// @ts-ignore
		resolved()?.addEventListener("focusout", blurHanlder);
	});
	onCleanup(() => {
		document.removeEventListener("keydown", keyboardListener);
		// @ts-ignore
		resolved()?.removeEventListener("focusout", blurHanlder);
	});

	return <>{resolved()}</>;
};
