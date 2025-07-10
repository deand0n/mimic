import { ShortRuleList } from "./rules/short-rule-list";

function App() {
	const [rules, setRules] = createSignal<MockRule[]>([]);

	onMount(async () => {
		const result = await storage.getItem<MockRule[]>("local:rules", {
			fallback: [],
		});
		setRules(result);
		const unwatch = storage.watch<MockRule[]>("local:rules", (r) => {
			setRules(r ?? []);
		});

		return () => {
			unwatch();
		};
	});

	const openOptions = () => {
		browser.runtime.openOptionsPage();
	};

	const onPause = async (rule: MockRule) => {
		const result = await storage.getItem<MockRule[]>("local:rules", {
			fallback: [],
		});

		const found = result.find((r) => r.id === rule.id);

		if (!found) {
			console.log(`cannot pause rule ${rule.id}`);
			return;
		}

		found.paused = !found.paused;

		storage.setItem("local:rules", result);
	};
	return (
		<div class="p-3 caret-primary flex flex-col gap-2">
			<button
				type="button"
				class="btn btn-primary rounded-box"
				onClick={openOptions}
			>
				Add rules
			</button>
			<ShortRuleList rules={rules()} onPause={onPause} />
		</div>
	);
}

export default App;
