const r = new Ractive({
    el: 'body',
    template: '#template',
    computed: {
        totalLogs: function () {
            const self = this;
            const data = self.get('data');
            return Object.keys(data)
                .reduce((acc, key) => {
                    const matches = data[key];
                    return acc + matches.length;
                }, 0);
        },
        logTypes: function () {
            const self = this;
            const data = self.get('data');
            return Object.keys(data)
                .reduce((acc, key) => {
                    const matches = data[key];
                    matches.forEach(({
                        type
                    }) => {
                        if (type) {
                            acc[type] = acc[type] || 0;
                            acc[type]++;
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
                    matches.forEach(({
                        tag
                    }) => {
                        if (tag) {
                            acc[tag] = acc[tag] || 0;
                            acc[tag]++;
                        }
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
                    matches.forEach(({
                        exception,
                        original
                    }) => {
                        if (exception) {
                            acc[original] = key;
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
    .then(({
        args,
        data
    }) => {
        r.set('data',
            data
        );
        r.set('title',
            Object.keys(args)
            .map(key => `--${key} ${args[key]}`).join(' ')
        );
    });