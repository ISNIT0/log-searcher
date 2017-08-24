const argv = require('yargs').argv
const dir = require('node-dir');
const fs = require('fs');


if (!argv.dir) {
    console.log('Please specify a directory to scan: --dir ../kiwix-android/app/src/main');
    process.exit();
}

const search = (/(Log\.(v|d|i|w|e|wtf|println|isLoggable|getStackTraceString)\([^\;]*)/g);
const path = argv.dir;
const args = ['-r'];

const fileMatches = {};

console.info('Recursively scanning for *.java files in:', __dirname + '/' + path);

dir.readFiles(__dirname + '/' + path, {
        match: /.java$/
    },
    function (err, content, fileName, next) {
        if (err) throw err;
        const res = content.match(search) || [];
        const fn = path.slice(1) + fileName.slice(__dirname.length + 1);
        fileMatches[fn] = res;
        next(null);
    },
    function (err, files) {
        console.info(`Found '${files.length}' files`);
        fs.writeFileSync('./data.json', JSON.stringify(fileMatches), 'utf8');
        console.info(`Successfully written to ./data.json
        
        *---------------------------------------*
        | To view the data, run "npm run serve" |
        *---------------------------------------*\n`);
    });