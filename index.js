const semver = require('semver');
const argv = require('yargs').argv
const dir = require('node-dir');
const fs = require('fs');
const path = require('path');
const package = require('./package.json');


require('scribe-js')();
let console = process.console;

console.log(`Starting Log-Searcher version [${package.version}]`);

if (!argv.dir) {
    console.log('Please specify a directory to scan: --dir ../kiwix-android/app/src/main');
    process.exit();
}

const logSearches = {
    android: /(Log\.(v|d|i|w|e|wtf|println|isLoggable|getStackTraceString)\([^\;]*)/g,
    timber: /(Timber\.(v|d|i|w|e|wtf|tag)\([^\;]*)/g
};

const logParsers = {
    android: function (logLine) {
        const [type, args] = logLine.match(/Log\.([^\(]*)\(([^\)]*)/).slice(1);
        const [tag, message, exception] = args.match(/(".*?"*|[^",\s]+)(?=\s*,|\s*$)/g);
        return {
            type,
            tag,
            message,
            exception,
            original: logLine
        };
    },
    timber: function (logLine) {
        const [type, args] = logLine.match(/Timber\.([^\(]*)\(([^\Z]*)/).slice(1);
        const argsList = args.slice(0, -1).match(/(".*?"*|[^",\s]+)(?=\s*,|\s*$)/g);
        if (type === 'tag') {
            return {
                type,
                tag: args,
                original: logLine
            };
        } else {
            const firstArgIsString = argsList[0][0] === '\'' || argsList[0][0] === '"';
            let exception;
            let message;
            if (firstArgIsString) {
                exception = undefined;
                message = argsList.join(','); //There may be string substitution
            } else {
                exception = argsList[0];
                message = argsList.slice(1).join(','); //There may be string substitution
            }
            return {
                type,
                tag: undefined,
                message,
                exception,
                original: logLine
            };
        }
    }
};

const mode = argv.mode || 'android';
const workingPath = path.resolve(__dirname, argv.dir);
console.info(`"dir" argument resovled to [${workingPath}]`);
const args = ['-r'];

const fileMatches = {};

console.info('Recursively scanning for *.java files in:', workingPath);

dir.readFiles(workingPath, {
        match: /.java$/
    },
    function (err, content, fileName, next) {
        if (err) throw err;
        const res = content.match(logSearches[mode]) || [];
        const fn = workingPath.slice(1) + fileName.slice(__dirname.length + 1);
        fileMatches[fn] = res.map(logParsers[mode]);
        next(null);
    },
    function (err, files) {
        console.info(`Found '${files.length}' files`);
        fs.writeFileSync('./data.json', JSON.stringify({
            version: package.version,
            args: argv,
            generatedAt: Date.now(),
            data: fileMatches
        }), 'utf8');
        console.info(`Successfully written to ./data.json
        
        *---------------------------------------*
        | To view the data, run "npm run serve" |
        *---------------------------------------*\n`);
    });