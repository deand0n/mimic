import type { MockRule } from "@/utils/type";
import { ListKeyboardNavigator } from "../keyboard-navigation/list-keyboard-navigation";

export type RuleListProps = {
	rules: MockRule[];
	onEdit?: (rule: MockRule) => void;
	onPause?: (rule: MockRule) => void;
	onDelete?: (rule: MockRule) => void;
};

export const RuleList = (props: RuleListProps) => {
	const [focusedIndex, setFocusedIndex] = createSignal<number>();

	const getBadgeColor = (rule: MockRule): string => {
		switch (rule.method) {
			case "all":
			case "other":
			case "connect":
			case "head":
			case "options":
				return "badge-neutral text-neutral-content border-neutral";
			case "delete":
				return "badge-error border-error";
			case "get":
				return "badge-primary border-primary";
			case "patch":
			case "put":
				return "badge-accent border-accent";
			case "post":
				return "badge-secondary border-secondary";
		}

		return "";
	};

	return (
		<ListKeyboardNavigator
			items={props.rules}
			onFocusedIndexChange={setFocusedIndex}
		>
			<ul class="list w-full">
				<Show when={!props.rules.length}>
					<div role="alert" class="alert alert-info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-6 w-6 shrink-0 stroke-current"
							role="img"
							aria-label="info"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>Added rules will be visible here</span>
					</div>
				</Show>
				<For each={props.rules}>
					{(item, index) => (
						// biome-ignore lint/a11y/useSemanticElements: need list of focusable but not clickable elements
						<li
							// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: reason above
							role="button"
							tabIndex={0}
							class="list-row items-center relative focus:outline-1 focus:outline-primary focus-within:outline-1 focus-within:outline-primary"
						>
							<div
								class="badge badge-soft border-1 uppercase w-20"
								classList={{ [getBadgeColor(item)]: true }}
							>
								{item.method}
							</div>
							<div class="flex flex-row gap-2 items-center">
								<div class="tooltip" data-tip={item.name}>
									<div class="max-w-80 truncate">
										{item.name}
									</div>
								</div>
								<div class="tooltip" data-tip={item.url}>
									<div class="text-xs text-base-content/60 max-w-40 truncate">
										({item.url})
									</div>
								</div>
							</div>
							<div class="flex flex-row items-center gap-1">
								<Show
									when={focusedIndex() === index()}
									fallback={
										<div class="kbd w-5 invisible"></div>
									}
								>
									<kbd class="kbd bg-neutral/50 text-neutral-content">
										P
									</kbd>
								</Show>
								<input
									type="checkbox"
									checked={!item.paused}
									class="toggle toggle-success __key-toggle"
									onChange={() => props.onPause?.(item)}
								/>
							</div>
							<div>
								<button
									class="btn btn-info w-24 pl-0 pr-7"
									type="button"
									onClick={() => props.onEdit?.(item)}
								>
									<Show
										when={focusedIndex() === index()}
										fallback={
											<div class="kbd w-5 invisible"></div>
										}
									>
										<kbd class="kbd bg-neutral/50 text-neutral-content __key-edit">
											E
										</kbd>
									</Show>
									Edit
								</button>
							</div>
						</li>
					)}
				</For>
			</ul>
		</ListKeyboardNavigator>
	);
};
