/** @type {import('prettier').Config & import('@ianvs/prettier-plugin-sort-imports').PluginConfig} */
const config = {
	endOfLine: "lf",
	semi: true,
	useTabs: false,
	singleQuote: true,
	arrowParens: "always",
	tabWidth: 2,
	trailingComma: "all",
	importOrder: [
		"^(react/(.*)$)|^(react$)",
		"^(next/(.*)$)|^(next$)",
		"<THIRD_PARTY_MODULES>",
		"",
		"^types$",
		"^~/lib/(.*)$",
		"^~/lib/hooks/(.*)$",
		"^~/components/ui/(.*)$",
		"^~/components/(.*)$",
		"^~/app/(.*)$",
		"^~/(.*)$",
		"",
		"^[./]",
	],
	importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
	plugins: ["@ianvs/prettier-plugin-sort-imports"],
};

export default config;
