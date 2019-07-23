'use strict';

var utils = require('../../../utils/utils');

var BaseXform = require('../base-xform');

var BaseCellAnchorXform = function BaseCellAnchorXform() {};

utils.inherits(BaseCellAnchorXform, BaseXform, {
  parseOpen: function parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }

    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          range: {
            editAs: node.attributes.editAs || 'oneCell'
          }
        };
        break;

      default:
        this.parser = this.map[node.name];

        if (this.parser) {
          this.parser.parseOpen(node);
        }

        break;
    }

    return true;
  },
  parseText: function parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  },
  reconcilePicture: function reconcilePicture(model, options) {
    if (model && model.rId) {
      var rel = options.rels[model.rId];
      var match = rel.Target.match(/.*\/media\/(.+[.][a-z]{3,4})/);

      if (match) {
        var name = match[1];
        var mediaId = options.mediaIndex[name];
        return options.media[mediaId];
      }
    }

    return undefined;
  }
});
module.exports = BaseCellAnchorXform;
//# sourceMappingURL=base-cell-anchor-xform.js.map
