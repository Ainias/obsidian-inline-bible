import { App, PluginSettingTab, Setting } from "obsidian";
import InlineBiblePlugin from "../main";

export class InlineBibleSettingTab extends PluginSettingTab {
	plugin: InlineBiblePlugin;

	constructor(app: App, plugin: InlineBiblePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Prefix')
			.setDesc('Prefix for the inline Bible reference')
			.addText(text => text
				.setPlaceholder('Enter your prefix')
				.setValue(this.plugin.settings.prefix)
				.onChange(async (value) => {
					this.plugin.settings.prefix = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Bible location')
			.setDesc('Location of your Bible files')
			.addText(text => text
				.setPlaceholder('Bible location')
				.setValue(this.plugin.settings.bibleLocation)
				.onChange(async (value) => {
					this.plugin.settings.bibleLocation = value;
					await this.plugin.saveSettings();
				}));
	}
}
