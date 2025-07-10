import type { MockRule } from "@/utils/type";

export default defineBackground(() => {
	const initRules = async () => {
		const storedRules = await storage.getItem<MockRule[]>("local:rules", {
			fallback: [],
		});

		const rules: Browser.declarativeNetRequest.Rule[] = storedRules
			.map((rule, index) => {
				if (rule.paused) {
					console.debug(`Rule ${rule.name ?? rule.id} is paused`);
					return null;
				}

				const validMethods = [
					"all",
					"connect",
					"delete",
					"get",
					"head",
					"options",
					"other",
					"patch",
					"post",
					"put",
				] as (Browser.declarativeNetRequest.RequestMethod | "all")[];

				if (
					!rule.url ||
					!rule.response ||
					!validMethods.includes(rule.method)
				) {
					console.log(`Invalid rule ${rule.name ?? rule.id}`);
					return null;
				}

				const method = rule.method === "all" ? null : rule.method;

				return {
					id: index + 1,
					priority: 1,
					action: {
						type: "redirect",
						redirect: {
							url: `data:application/json,${encodeURIComponent(
								JSON.stringify(rule.response),
							)}`,
						},
					},
					condition: {
						urlFilter: rule.url,
						resourceTypes: ["xmlhttprequest"],
						...(method && {
							requestMethods: [method],
						}),
					},
				} as Browser.declarativeNetRequest.Rule;
			})
			.filter((r) => r != null);

		browser.declarativeNetRequest.getDynamicRules((existingRules) => {
			const existingRuleIds = existingRules.map((rule) => rule.id);
			browser.declarativeNetRequest.updateDynamicRules(
				{
					removeRuleIds: existingRuleIds,
					addRules: rules,
				},
				() => {
					console.debug("Rules applied");
				},
			);
		});
	};
	storage.watch("local:rules", () => {
		initRules();
	});

	browser.runtime.onInstalled.addListener((details) => {
		initRules();
		browser.declarativeNetRequest.setExtensionActionOptions({
			displayActionCountAsBadgeText: true,
		});
		if (details.reason === "update") {
			browser.action.setBadgeText({ text: "NEW" });
			browser.action.setBadgeBackgroundColor({ color: "#f7c6bc" });
			storage.setItem("local:pendingUpdateNotification", true);
		}
	});

	// Check if there's a pending notification when extension starts
	browser.runtime.onStartup.addListener(async () => {
		const pendingUpdateNotification = await storage.getItem(
			"local:pendingUpdateNotification",
		);

		if (pendingUpdateNotification) {
			browser.action.setBadgeText({ text: "NEW" });
			browser.action.setBadgeBackgroundColor({ color: "#f7c6bc" });
		}
	});
});
