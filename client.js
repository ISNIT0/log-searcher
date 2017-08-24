const r = new Ractive({
    el: 'body',
    template: '#template',
    computed: {
        logTypes: function () {
            const self = this;
            const data = self.get('data');
            const search = /Log\.(v|d|i|w|e|wtf|println|isLoggable|getStackTraceString)/g;
            return Object.keys(data)
                .reduce((acc, key) => {
                    const matches = data[key];
                    matches.forEach(str => {
                        const type = str.match(search);
                        if (type) {
                            acc[type[0]] = acc[type[0]] || 0;
                            acc[type[0]]++;
                        }
                    });
                    return acc;
                }, {});
        },
        logTags: function () {
            const self = this;
            const data = self.get('data');
            return Object.keys(data)
                .reduce((acc, key) => {
                    const matches = data[key];
                    matches.forEach(str => {
                        const tag = str.split('(')[1].split(',')[0];
                        acc[tag] = acc[tag] || 0;
                        acc[tag]++;
                    });
                    return acc;
                }, {});
        },
        logExceptions: function () {
            const self = this;
            const data = self.get('data');
            return Object.keys(data)
                .reduce((acc, key) => {
                    const matches = data[key];
                    matches.forEach(str => {
                        const withoutStrings = str.replace(/"[^"]*"/g, '');
                        const exploded = withoutStrings.split(',');
                        if (exploded.length === 3) {
                            acc[str] = key;
                        }
                    });
                    return acc;
                }, {});
        },
        filesWithLogs: function () {
            const self = this;
            const data = self.get('data');
            const ret = Object.keys(data)
                .reduce((acc, key) => {
                    const matches = data[key];
                    if (matches.length === 0) {
                        acc.without++;
                    } else {
                        acc.with++;
                    }
                    return acc;
                }, {
                    without: 0,
                    with: 0,
                    percentageWith: 0
                });
            ret.percentageWith = Math.floor(ret.with / (ret.with + ret.without) * 10000) / 100 + '%';
            return ret;
        }
    }
});

fetch('./data.json')
    .then(d => d.json())
    .then(data => {
        r.set('data',
            data
        );
    });