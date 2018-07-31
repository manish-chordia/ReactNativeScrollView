var path = require('path');
var RawSource = require('webpack-sources/lib/RawSource');

module.exports = EmitStatsPlugin;

function EmitStatsPlugin(opts) {
    this.opts = opts || {};
}

EmitStatsPlugin.prototype.apply = function(compiler) {
    compiler.plugin(
        'emit',
        function(compilation, callback) {
            var css = [],
                js = [],
                img = [],
                json = [];
            var imgRegExp = /\.(gif|jpg|jpeg|png|webp|svg)$/i;
            Object.keys(compilation.assets).map(function(a) {
                var ext = path.extname(a);
                switch (true) {
                    case ext === '.js':
                        js.push(a);
                        break;
                    case ext === '.json':
                        json.push(a);
                        break;
                    case ext === '.css':
                        css.push(a);
                        break;
                    case imgRegExp.test(ext):
                        img.push(a);
                        break;
                }
            });
            var current = {
                css: css,
                js: js,
                json: json,
                img: img,
            };
            var out = this.opts.filename || 'versions.json';
            compilation.assets[out] = new RawSource(JSON.stringify(current));
            callback();
        }.bind(this)
    );
};
