const path = require("path");
const appConfig = require("../config").config;

module.exports = ({ config }) => {
	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		use: [
			{
				loader: require.resolve("ts-loader"),
				options: {
					transpileOnly: true,
					configFile: path.join(appConfig.paths.rootDir, "tsconfig.json")
				}
			}
		]
	});

	config.resolve.extensions.push(".ts", ".tsx");
	return config;
};
