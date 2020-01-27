const path = require("path");

const rootDir = path.resolve(__dirname);
const sourceDir = path.join(rootDir, "src");

const paths = {
	sourceDir,
	rootDir,
	storybookDir: path.join(rootDir, ".storybook"),
};

module.exports.paths = paths;

const config = {
	paths,
};

module.exports.config = config;
