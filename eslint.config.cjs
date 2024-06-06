/** @type {import("eslint").Linter.Config} */
const config = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
	plugins: [
		"@typescript-eslint",
		"tailwindcss",
		"unused-imports",
		// // NOTE: Cloudflare Workers only support Edge at the moment
		// 'next-on-pages'
	],
	extends: [
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"prettier",
		"plugin:tailwindcss/recommended",
		// // NOTE: Cloudflare Workers only support Edge at the moment
		// 'plugin:next-on-pages/recommended',
		"next/core-web-vitals",
	],
	overrides: [
		{
			files: ["*.ts", "*.js", "*.tsx", "*.jsx"],
			extends: ["biome"],
		},
	],
	rules: {
		// warn import from specific source
		"no-restricted-imports": [
			"warn",
			{
				paths: [
					// {
					//   name: 'next/navigation',
					//   importNames: [
					//     'getPathname',
					//     'redirect',
					//     'usePathname',
					//     'useRouter'
					//   ],
					//   message: 'We override default next/navigation in ~/lib/navigation'
					// },
					// {
					//   name: 'next/link',
					//   message: 'We override default next/link in ~/lib/navigation'
					// }
				],
			},
		],
		"no-useless-rename": [
			"error",
			{
				ignoreDestructuring: false,
				ignoreImport: false,
				ignoreExport: false,
			},
		],

		// These opinionated rules are enabled in stylistic-type-checked above.
		// Feel free to reconfigure them to your own preference.
		"@typescript-eslint/array-type": "off",
		"@typescript-eslint/consistent-type-definitions": "off",

		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				varsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/no-misused-promises": [
			2,
			{
				checksVoidReturn: { attributes: false },
			},
		],
		"tailwindcss/no-custom-classname": "off",
	},
	settings: {
		tailwindcss: {
			callees: ["cn", "cva"],
			config: "tailwind.config.ts",
		},
	},
};

module.exports = config;
