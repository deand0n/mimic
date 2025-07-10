import type { MockRule, Optional } from "@/utils/type";
import { Edit } from "../edit/edit";
import { HomeKeyboardNavigation } from "../keyboard-navigation/home-keyboard-navigation";
import { RuleList } from "./rule-list";

enum Action {
	NONE,
	EDIT,
	CREATE,
}

export const Home = () => {
	const [rules, setRules] = createSignal<MockRule[]>([]);
	const [selectedRule, setSelectedRule] = createSignal<Optional<MockRule>>();
	const [action, setAction] = createSignal<Action>(Action.NONE);

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

	const onSelect = (rule: MockRule) => {
		setAction(Action.NONE);
		setSelectedRule(rule);
		setAction(Action.EDIT);
	};

	const onCreate = () => {
		if (action() !== Action.NONE) return;

		setSelectedRule(undefined);
		setAction(Action.CREATE);
	};

	const onDelete = async (rule: MockRule) => {
		if (selectedRule()?.id === rule.id) {
			setAction(Action.NONE);
		}

		const result = await storage.getItem<MockRule[]>("local:rules", {
			fallback: [],
		});

		const filtered = result.filter((r) => r.id !== rule.id);
		storage.setItem("local:rules", filtered);
	};

	const onBack = () => {
		setSelectedRule(undefined);
		setAction(Action.NONE);
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

	const onSubmit = async (rule: MockRule) => {
		// TODO: add error handling
		const rules = await storage.getItem<MockRule[]>("local:rules", {
			fallback: [],
		});

		if (action() === Action.EDIT) {
			const index = rules.findIndex((r) => r.id === rule.id);
			rules[index] = rule;
		} else if (action() === Action.CREATE) {
			rules.push(rule);
			setAction(Action.NONE);
		}

		await storage.setItem("local:rules", rules);
	};

	return (
		<HomeKeyboardNavigation>
			<div class="flex flex-row justify-between w-full h-full gap-5">
				<div class="flex flex-row grow min-h-80 flex-wrap bg-base-200 border-1 border-neutral/90 rounded-box p-4 overflow-scroll">
					<RuleList
						rules={rules()}
						onEdit={onSelect}
						onPause={onPause}
					/>
				</div>
				<div class="shrink h-fit min-h-80 min-w-xl bg-base-200 rounded-box border-1 border-neutral/90 p-4 flex items-stretch">
					<Switch
						fallback={
							<div>
								something went wrong, please reload the page
							</div>
						}
					>
						<Match when={action() === Action.NONE}>
							<div class="flex flex-row justify-center self-stretch w-full items-center">
								<button
									class="btn btn-primary __key-create"
									type="button"
									onClick={onCreate}
								>
									<kbd class="kbd bg-neutral/50 text-neutral-content">
										A
									</kbd>
									Create New Rule
								</button>
							</div>
						</Match>
						<Match when={action() === Action.EDIT}>
							<Edit
								rule={selectedRule()}
								onSubmit={onSubmit}
								onDelete={() => onDelete(selectedRule()!)}
								onBack={onBack}
							/>
						</Match>
						<Match when={action() === Action.CREATE}>
							<Edit onSubmit={onSubmit} onBack={onBack} />
						</Match>
					</Switch>
				</div>
			</div>
		</HomeKeyboardNavigation>
	);
};
