import { createSignal } from "solid-js";
import type { MockRule } from "@/utils/type";
import { EditKeyboardNavigation } from "../keyboard-navigation/edit-keyboard-navigation";

export type EditProps = {
	rule?: MockRule;
	onSubmit?: (rule: MockRule) => void;
	onDelete?: () => void;
	onBack?: () => void;
};
export const Edit = (props: EditProps) => {
	const [name, setName] = createSignal(props.rule?.name ?? `New Rule`);
	const [url, setUrl] = createSignal(props.rule?.url ?? "");
	const [response, setResponse] = createSignal(props.rule?.response ?? "");
	const [method, setMethod] = createSignal(
		props.rule?.method ??
			("get" as Browser.declarativeNetRequest.RequestMethod),
	);

	const formatJson = () => {
		setResponse("");
	};

	const onSubmit = async (event?: SubmitEvent) => {
		const rule: MockRule = {
			id: props.rule?.id ?? Date.now(),
			name: name(),
			url: url(),
			response: response(),
			method: method(),
		};

		props.onSubmit?.(rule);
		event?.preventDefault();
	};

	return (
		<EditKeyboardNavigation>
			<form onSubmit={onSubmit} class="flex flex-col gap-5 w-full">
				<div class="flex flex-row justify-between">
					<button
						class="btn border-1 border-neutral __key-back"
						type="button"
						onClick={() => props.onBack?.()}
					>
						<kbd class="kbd bg-neutral/50 text-neutral-content">
							B
						</kbd>
						Back
					</button>
					<div class="flex flex-row justify-end gap-5">
						<button
							class="btn btn-primary __key-save"
							type="submit"
						>
							<kbd class="kbd bg-neutral/50 text-neutral-content">
								S
							</kbd>
							{props.rule ? "Save Changes" : "Create Rule"}
						</button>
						{/* TODO: add "are you sure" modal */}
						<button
							class="btn btn-error __key-delete"
							type="button"
							onClick={() => props.onDelete?.()}
							disabled={!props.rule?.id}
						>
							<kbd class="kbd bg-neutral/50 text-neutral-content">
								D
							</kbd>
							Delete Rule
						</button>
					</div>
				</div>
				<fieldset class="fieldset">
					<label class="label flex flex-col">
						<div> Description</div>
						<input
							class="input w-full focus:input-primary validator"
							name="name"
							value={name()}
							type="text"
							placeholder="Enter rule name"
							required
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<label class="label flex flex-col">
						<div>Request URL pattern</div>
						<input
							class="input focus:input-primary w-full validator"
							value={url()}
							name="url"
							type="text"
							placeholder="e.g., *example.com/api/*"
							required
							onChange={(e) => setUrl(e.target.value)}
						/>
					</label>

					<label class="label flex flex-col">
						<div> Method:</div>
						<select
							class="select focus:select-primary w-full validator"
							value={method()}
							name="method"
							required
							onChange={(e) =>
								setMethod(
									e.target
										.value as Browser.declarativeNetRequest.RequestMethod,
								)
							}
						>
							<option value="all">ALL</option>
							<option value="get">GET</option>
							<option value="post">POST</option>
							<option value="patch">PATCH</option>
							<option value="put">PUT</option>
							<option value="delete">DELETE</option>
						</select>
					</label>

					<label class="label flex flex-col relative">
						<div> Response Body:</div>
						<textarea
							class="textarea focus:textarea-primary w-full validator"
							value={response()}
							name="response"
							rows="15"
							placeholder="{ }"
							required
							onChange={(e) => setResponse(e.target.value)}
						></textarea>
						<button
							class="btn btn-square btn-soft rounded-selector absolute bottom-2 right-2"
							type="button"
							title="Format JSON"
							onClick={() => formatJson()}
						>
							{"{ }"}
						</button>
					</label>
				</fieldset>
			</form>
		</EditKeyboardNavigation>
	);
};
