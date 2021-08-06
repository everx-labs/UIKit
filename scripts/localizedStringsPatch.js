const fs = require('fs');

try {
    const localizedStringsFile = `${__dirname}/../node_modules/localized-strings/lib/LocalizedStrings.js`;
    const localizedStringsFileData = fs.readFileSync(
        localizedStringsFile,
        'utf8',
    );

    const result = localizedStringsFileData.replace(
        '} else if (typeof strings[key] !== "string") {',
        '} else if (typeof strings[key] !== "string" && typeof strings[key].valueOf() !== "string") {',
    );

    fs.writeFileSync(localizedStringsFile, result, 'utf8');
} catch (error) {
    console.error('Failed to apply localized-strings fixes with error:', error);
}
