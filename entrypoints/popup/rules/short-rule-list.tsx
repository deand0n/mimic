import type { MockRule } from "@/utils/type";

export type ShortRuleListProps = {
	rules: MockRule[];
	onPause?: (rule: MockRule) => void;
};

export const ShortRuleList = (props: ShortRuleListProps) => {
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
		<ul class="list w-full bg-base-200 rounded-box">
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
				{(item) => (
					<li class="list-row items-center">
						<div
							class="badge badge-soft badge-sm border-1 uppercase "
							classList={{ [getBadgeColor(item)]: true }}
						>
							{item.method}
						</div>
						<div class="flex flex-row gap-2 items-center">
							<div class="tooltip" data-tip={item.name}>
								<div class="truncate">{item.name}</div>
							</div>
						</div>
						<div class="flex flex-row items-center gap-1">
							<input
								type="checkbox"
								checked={!item.paused}
								class="toggle toggle-success __key-toggle"
								onChange={() => props.onPause?.(item)}
							/>
						</div>
					</li>
				)}
			</For>
		</ul>
	);
};
