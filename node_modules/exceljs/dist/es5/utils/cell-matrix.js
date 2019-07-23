'use strict';

var _ = require('./under-dash');

var colCache = require('./col-cache');

var CellMatrix = function CellMatrix(template) {
  this.template = template;
  this.sheets = {};
};

CellMatrix.prototype = {
  addCell: function addCell(addressStr) {
    this.addCellEx(colCache.decodeEx(addressStr));
  },
  getCell: function getCell(addressStr) {
    return this.findCellEx(colCache.decodeEx(addressStr), true);
  },
  findCell: function findCell(addressStr) {
    return this.findCellEx(colCache.decodeEx(addressStr), false);
  },
  findCellAt: function findCellAt(sheetName, rowNumber, colNumber) {
    var sheet = this.sheets[sheetName];
    var row = sheet && sheet[rowNumber];
    return row && row[colNumber];
  },
  addCellEx: function addCellEx(address) {
    if (address.top) {
      for (var row = address.top; row <= address.bottom; row++) {
        for (var col = address.left; col <= address.right; col++) {
          this.getCellAt(address.sheetName, row, col);
        }
      }
    } else {
      this.findCellEx(address, true);
    }
  },
  getCellEx: function getCellEx(address) {
    return this.findCellEx(address, true);
  },
  findCellEx: function findCellEx(address, create) {
    var sheet = this.findSheet(address, create);
    var row = this.findSheetRow(sheet, address, create);
    return this.findRowCell(row, address, create);
  },
  getCellAt: function getCellAt(sheetName, rowNumber, colNumber) {
    var sheet = this.sheets[sheetName] || (this.sheets[sheetName] = []);
    var row = sheet[rowNumber] || (sheet[rowNumber] = []);
    var cell = row[colNumber] || (row[colNumber] = {
      sheetName: sheetName,
      address: colCache.n2l(colNumber) + rowNumber,
      row: rowNumber,
      col: colNumber
    });
    return cell;
  },
  removeCellEx: function removeCellEx(address) {
    var sheet = this.findSheet(address);

    if (!sheet) {
      return;
    }

    var row = this.findSheetRow(sheet, address);

    if (!row) {
      return;
    }

    delete row[address.col];
  },
  forEachInSheet: function forEachInSheet(sheetName, callback) {
    var sheet = this.sheets[sheetName];

    if (sheet) {
      sheet.forEach(function (row, rowNumber) {
        if (row) {
          row.forEach(function (cell, colNumber) {
            if (cell) {
              callback(cell, rowNumber, colNumber);
            }
          });
        }
      });
    }
  },
  forEach: function forEach(callback) {
    var _this = this;

    _.each(this.sheets, function (sheet, sheetName) {
      _this.forEachInSheet(sheetName, callback);
    });
  },
  map: function map(callback) {
    var results = [];
    this.forEach(function (cell) {
      results.push(callback(cell));
    });
    return results;
  },
  findSheet: function findSheet(address, create) {
    var name = address.sheetName;

    if (this.sheets[name]) {
      return this.sheets[name];
    }

    if (create) {
      return this.sheets[name] = [];
    }

    return undefined;
  },
  findSheetRow: function findSheetRow(sheet, address, create) {
    var row = address.row;

    if (sheet && sheet[row]) {
      return sheet[row];
    }

    if (create) {
      return sheet[row] = [];
    }

    return undefined;
  },
  findRowCell: function findRowCell(row, address, create) {
    var col = address.col;

    if (row && row[col]) {
      return row[col];
    }

    if (create) {
      return row[col] = this.template ? Object.assign(address, JSON.parse(JSON.stringify(this.template))) : address;
    }

    return undefined;
  },
  spliceRows: function spliceRows(sheetName, start, numDelete, numInsert) {
    var sheet = this.sheets[sheetName];

    if (sheet) {
      var inserts = [];

      for (var i = 0; i < numInsert; i++) {
        inserts.push([]);
      }

      sheet.splice.apply(sheet, [start, numDelete].concat(inserts));
    }
  },
  spliceColumns: function spliceColumns(sheetName, start, numDelete, numInsert) {
    var sheet = this.sheets[sheetName];

    if (sheet) {
      var inserts = [];

      for (var i = 0; i < numInsert; i++) {
        inserts.push(null);
      }

      _.each(sheet, function (row) {
        row.splice.apply(row, [start, numDelete].concat(inserts));
      });
    }
  }
};
module.exports = CellMatrix;
//# sourceMappingURL=cell-matrix.js.map
