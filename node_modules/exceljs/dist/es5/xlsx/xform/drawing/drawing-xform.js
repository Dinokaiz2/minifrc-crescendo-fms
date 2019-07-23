'use strict';

var utils = require('../../../utils/utils');

var colCache = require('../../../utils/col-cache');

var XmlStream = require('../../../utils/xml-stream');

var BaseXform = require('../base-xform');

var TwoCellAnchorXform = require('./two-cell-anchor-xform');

var OneCellAnchorXform = require('./one-cell-anchor-xform');

var WorkSheetXform = module.exports = function () {
  this.map = {
    'xdr:twoCellAnchor': new TwoCellAnchorXform(),
    'xdr:oneCellAnchor': new OneCellAnchorXform()
  };
};

function getAnchorType(model) {
  var range = typeof model.range === 'string' ? colCache.decode(model.range) : model.range;
  return range.br ? 'xdr:twoCellAnchor' : 'xdr:oneCellAnchor';
}

utils.inherits(WorkSheetXform, BaseXform, {
  DRAWING_ATTRIBUTES: {
    'xmlns:xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main'
  }
}, {
  get tag() {
    return 'xdr:wsDr';
  },

  prepare: function prepare(model) {
    var _this = this;

    model.anchors.forEach(function (item, index) {
      item.anchorType = getAnchorType(item);
      var anchor = _this.map[item.anchorType];
      anchor.prepare(item, {
        index: index
      });
    });
  },
  render: function render(xmlStream, model) {
    var _this2 = this;

    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, WorkSheetXform.DRAWING_ATTRIBUTES);
    model.anchors.forEach(function (item) {
      var anchor = _this2.map[item.anchorType];
      anchor.render(xmlStream, item);
    });
    xmlStream.closeNode();
  },
  parseOpen: function parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }

    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          anchors: []
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
  parseClose: function parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.model.anchors.push(this.parser.model);
        this.parser = undefined;
      }

      return true;
    }

    switch (name) {
      case this.tag:
        return false;

      default:
        // could be some unrecognised tags
        return true;
    }
  },
  reconcile: function reconcile(model, options) {
    var _this3 = this;

    model.anchors.forEach(function (anchor) {
      if (anchor.br) {
        _this3.map['xdr:twoCellAnchor'].reconcile(anchor, options);
      } else {
        _this3.map['xdr:oneCellAnchor'].reconcile(anchor, options);
      }
    });
  }
});
//# sourceMappingURL=drawing-xform.js.map
