# Obsidian Inline Bible

(WIP) means Work in Progress. This is not possible yet, but planned.

This Plugin allows you to insert Bible verses inline in your notes from a folder inside your vault.
The bible is in a format that is easy to read, understand and modify:

- Every book is a folder with the name of the book, ex: `Genesis`
- Every chapter is a file with the name of the book and chapter, ex: `Genesis 1.md` inside the book folder
- Every verse begins with `[versenumber]` in a new line
- The verses should be in ascending order
- Every markdown is allowed inside verses, as long as the line starts with `[versenumber]`. I encourage you to use
	- Links to persons, explanations, etc.
	- Footnotes for inline explanations
- (WIP) Bible-References should start on a new line and can be added through `<span class='reference'>@Genesis 1,5-6.; @Genesis 5,15-6,4.</small>`-Tags
  - Notice the `.` at the end. View the references section to understand them
- Notes between verses are allowed and will be cited. The following things are always ignored:
	- Headings
	- Bible references
- If you only want to include verses and no comments, you can change that with the `!` modifier 
  - (WIP) or in the settings 

## References
References are in the format `@Book Chapter,Verse-Verse` or (WIP) `@Book Chapter,Verse-Chapter,Verse`. 
They start always with `@` (can be changed inside the settings) followed by the book, chapter and verse.
(WIP) In the top-right there is a chevron which can be used to retract the reference. This will be saved, as it only
adds or removes a `^` (see below) at the end of a reference.

You can modify the citation by adding a symbol at the end:
- With a `^` at the end: the reference is retracted. It will still go over the complete width, but is now smaller. 
  - (WIP) Hover will show the bibletext (respecting your page preview settings)
- (WIP) With a `.` at the end: the reference is only a link. Hover will show the bibletext (respecting your page preview settings)
- With a `!` at the end: notes between verses are ignored. Ex: `@Genesis 1,1-2!` will only cite the bible-verses without the notes between them
  - This can be combined with `^` and `.`, but must come before them

## Settings 
- You can change the folder where the bible is stored
- You can change the symbol that starts a reference (default: `@`)
- (WIP) You can change the modifier symbols for references (default: `^`, `.`, `!`)
- (WIP) You can change the default behavior if notes between verses should be included or not (default: `true`)
  - When set to false, `!` will include the notes between verses


# Ignore the rest of the readme. Just here for future reference

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an
  existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in
  your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required
  for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian
  can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't
  include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be
  in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major`
> after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version
> to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against
  your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, make sure to install eslint from terminal:
	- `npm install -g eslint`
- To use eslint to analyze this project use this command:
	- `eslint main.ts`
	- eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that
  folder:
	- `eslint .\src\`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
	"fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
	"fundingUrl": {
		"Buy Me a Coffee": "https://buymeacoffee.com",
		"GitHub Sponsor": "https://github.com/sponsors",
		"Patreon": "https://www.patreon.com/"
	}
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
