export type Optional<T> = T | undefined;

export type MockRule = {
	id: number;
	name: string;
	url: string;
	response: string;
	method: Browser.declarativeNetRequest.RequestMethod | "all";
	paused?: boolean;
};
