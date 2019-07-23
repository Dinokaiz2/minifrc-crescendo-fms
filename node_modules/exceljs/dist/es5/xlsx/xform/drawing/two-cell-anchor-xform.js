'use strict';

var utils = require('../../../utils/utils');

var BaseCellAnchorXform = require('./base-cell-anchor-xform');

var StaticXform = require('../static-xform');

var CellPositionXform = require('./cell-position-xform');

var PicXform = require('./pic-xform');

var TwoCellAnchorXform = function TwoCellAnchorXform() {
  this.map = {
    'xdr:from': new CellPositionXform({
      tag: 'xdr:from'
    }),
    'xdr:to': new CellPositionXform({
      tag: 'xdr:to'
    }),
    'xdr:pic': new PicXform(),
    'xdr:clientData': new StaticXform({
      tag: 'xdr:clientData'
    })
  };
};

utils.inherits(TwoCellAnchorXform, BaseCellAnchorXform, {
  get tag() {
    return 'xdr:twoCellAnchor';
  },

  prepare: function prepare(model, options) {
    this.map['xdr:pic'].prepare(model.picture, options);
  },
  render: function render(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      editAs: model.range.editAs || 'oneCell'
    });
    this.map['xdr:from'].render(xmlStream, model.range.tl);
    this.map['xdr:to'].render(xmlStream, model.range.br);
    this.map['xdr:pic'].render(xmlStream, model.picture);
    this.map['xdr:clientData'].render(xmlStream, {});
    xmlStream.closeNode();
  },
  parseClose: function parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }

      return true;
    }

    switch (name) {
      case this.tag:
        this.model.range.tl = this.map['xdr:from'].model;
        this.model.range.br = this.map['xdr:to'].model;
        this.model.picture = this.map['xdr:pic'].model;
        return false;

      default:
        // could be some unrecognised tags
        return true;
    }
  },
  reconcile: function reconcile(model, options) {
    model.medium = this.reconcilePicture(model.picture, options);
  }
});
module.exports = TwoCellAnchorXform;
//# sourceMappingURL=two-cell-anchor-xform.js.map
