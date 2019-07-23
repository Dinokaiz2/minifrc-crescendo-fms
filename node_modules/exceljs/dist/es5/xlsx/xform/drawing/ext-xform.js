'use strict';

var utils = require('../../../utils/utils');

var BaseXform = require('../base-xform');

var ExtXform = module.exports = function (options) {
  this.tag = options.tag;
  this.map = {};
};
/** https://en.wikipedia.org/wiki/Office_Open_XML_file_formats#DrawingML */


var EMU_PER_PIXEL_AT_96_DPI = 9525;
utils.inherits(ExtXform, BaseXform, {
  render: function render(xmlStream, model) {
    xmlStream.openNode(this.tag);
    var width = Math.floor(model.width * EMU_PER_PIXEL_AT_96_DPI);
    var height = Math.floor(model.height * EMU_PER_PIXEL_AT_96_DPI);
    xmlStream.addAttribute('cx', width);
    xmlStream.addAttribute('cy', height);
    xmlStream.closeNode();
  },
  parseOpen: function parseOpen(node) {
    if (node.name === this.tag) {
      this.model = {
        width: parseInt(node.attributes.cx || '0', 10) / EMU_PER_PIXEL_AT_96_DPI,
        height: parseInt(node.attributes.cy || '0', 10) / EMU_PER_PIXEL_AT_96_DPI
      };
      return true;
    }

    return false;
  },
  parseText: function parseText()
  /* text */
  {},
  parseClose: function parseClose()
  /* name */
  {
    return false;
  }
});
//# sourceMappingURL=ext-xform.js.map
