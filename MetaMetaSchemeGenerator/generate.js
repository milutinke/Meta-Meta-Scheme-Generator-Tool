// Libraries
const JSONSchemaGenerator = require('json-schema-generator');
const config = require('./configs');
const colors = require('colors');
const fs = require('fs');

// Constants
const NPM_FOLDER = './node_modules';

// Functions
const deleteFolderRecursive = path => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file, index) => {
			const currentPath = `${path}/${file}`;

			if (fs.lstatSync(currentPath).isDirectory())
				deleteFolderRecursive(currentPath);
			else fs.unlinkSync(currentPath);
		});

		fs.rmdirSync(path);
	}
};

const handleError = error => {
	console.log(`${error}`.red);
	deleteFolderRecursive(NPM_FOLDER);
};

const main = () => {
	// Check if the input file exists
	if(!fs.existsSync(config.INPUT_FILE)) {
		handleError(`File does not exists!`.red);
		return;
	}

	// Read JSON from the input file
	const metaScheme = fs.readFileSync(config.INPUT_FILE, 'utf8').toString();

	// Check if we have any input
	if(!metaScheme.length) {
		handleError(`Empty file!`.red);
		deleteFolderRecursive(NPM_FOLDER);
		return;
	}

	// Generate Meta Meta Scheme and write it to output file
	fs.writeFileSync(config.OUTPUT_FILE, JSON.stringify(JSONSchemaGenerator(JSON.parse(metaScheme)), null, 2));
	console.log(`Successfully generated :)`.green);
	deleteFolderRecursive(NPM_FOLDER);
};

main();