var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp').sync;
var _ = require('lodash');
var Promise = require('rsvp').Promise;

var Filter = require('broccoli-filter');

/**
 * Transforms /pages/foo/bar.html to /pages/foo/bar/index.html for prettier routing (i.e.
 * /foo/bar/ instead of /foo/bar.html
 *
 * Leaves /pages/foo/index.html as /pages/foo/index.html
 */

var IndexifyFilter = function(inputTree, options) {
  if (!(this instanceof IndexifyFilter)) {
    return new IndexifyFilter(inputTree, options);
  }

  Filter.call(this, inputTree, options);
  this.options = options;
};

IndexifyFilter.prototype = Object.create(Filter.prototype);
IndexifyFilter.prototype.constructor = Filter;

IndexifyFilter.prototype.extensions = ['html'];
IndexifyFilter.prototype.targetExtension = 'html';

IndexifyFilter.prototype.processFile = function (srcDir, destDir, relativePath) {
  var string = fs.readFileSync(srcDir + '/' + relativePath, { encoding: 'utf8' });

  return Promise.resolve(string)
    .then(function (outputString) {
      var outputPath = this.getDestFilePath(relativePath);

      var pageName = path.basename(outputPath, path.extname(outputPath));

      // if pageName is index, just use normal broccoli dest
      if ( pageName === 'index' ) {
        fs.writeFileSync(destDir + '/' + outputPath, outputString, { encoding: 'utf8' });
        return;
      }

      // otherwise create an indexified folder and write to it
      var indexDir = path.join(path.dirname(outputPath), pageName);
      var destPath = path.join(indexDir, 'index.' + this.targetExtension);

      var fullPath = path.join(destDir, destPath);
      mkdirp(path.dirname(fullPath));

      fs.writeFileSync(fullPath, outputString, { encoding: 'utf8' });

      return {
        outputFiles: [destPath]
      };
    }.bind(this));
};

module.exports = IndexifyFilter;
