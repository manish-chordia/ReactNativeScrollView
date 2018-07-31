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
            var imageAssets = {};
            var imgRegExp = /\.(gif|jpg|jpeg|png|webp|svg)$/i;
            Object.keys(compilation.assets).map(function(a) {
                var ext = path.extname(a);
                if (imgRegExp.test(ext)) {
                    var assetName = a.slice(0, -13).substring(7);
                    imageAssets[assetName] = a;
                }
            });
            var out = this.opts.filename || '../assets.json';
            compilation.assets[out] = new RawSource(JSON.stringify(imageAssets));
            callback();
        }.bind(this)
    );
};
