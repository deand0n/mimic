export type KeyDownHandler = (event: KeyboardEvent) => void;
export const keyDownListener = (
	event: KeyboardEvent,
	handlers: Map<string, KeyDownHandler>,
) => {
	const handler = handlers.get(event.code);

	if (!handler) {
		return;
	}

	handler(event);
};
