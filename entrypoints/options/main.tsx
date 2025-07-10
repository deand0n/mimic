import { render } from "solid-js/web";

import "./style.css";
import { HashRouter, Route } from "@solidjs/router";
import { App } from "./App";
import { Home } from "./home/home";

render(
	() => (
		<HashRouter root={App}>
			<Route path="/" component={Home} />
		</HashRouter>
	),
	document.getElementById("root")!,
);
