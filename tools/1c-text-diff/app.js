var dom = {
  leftInput: null,
  rightInput: null,
  structBody: null,
  tablesBody: null,
  jsonError: null,
  infoBtn: null,
  infoPanel: null,
};

function byId(id) {
  return document.getElementById(id);
}

function toggleInfoPanel() {
  var open = dom.infoPanel.style.display === 'block';
  dom.infoPanel.style.display = open ? 'none' : 'block';
  dom.infoPanel.setAttribute('aria-hidden', open ? 'true' : 'false');
}

function setLeftVersion(jsonText) {
  dom.leftInput.value = typeof jsonText === 'string' ? jsonText : JSON.stringify(jsonText, null, 2);
  compare();
}

function setRightVersion(jsonText) {
  dom.rightInput.value = typeof jsonText === 'string' ? jsonText : JSON.stringify(jsonText, null, 2);
  compare();
}

function setVersions(leftJsonText, rightJsonText) {
  setLeftVersion(leftJsonText);
  setRightVersion(rightJsonText);
}

function exposeApi() {
  if (typeof window === 'undefined') return;
  window.setLeftVersion = setLeftVersion;
  window.setRightVersion = setRightVersion;
  window.setVersions = setVersions;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

function createMatrix(rows, cols, fill) {
  var matrix = new Array(rows);
  for (var r = 0; r < rows; r++) {
    var row = new Array(cols);
    for (var c = 0; c < cols; c++) row[c] = fill;
    matrix[r] = row;
  }
  return matrix;
}

function createDict() {
  return Object.create(null);
}

function dictHas(dict, key) {
  return Object.prototype.hasOwnProperty.call(dict, key);
}

function MapStore() {
  this._data = createDict();
}

MapStore.prototype.set = function (key, value) {
  this._data[key] = value;
};

MapStore.prototype.get = function (key) {
  return this._data[key];
};

MapStore.prototype.has = function (key) {
  return dictHas(this._data, key);
};

MapStore.prototype.keys = function () {
  return Object.keys(this._data);
};

function SetStore() {
  this._data = createDict();
}

SetStore.prototype.add = function (key) {
  this._data[key] = true;
};

SetStore.prototype.has = function (key) {
  return dictHas(this._data, key);
};

function diffParts(s1, s2) {
  s1 = s1 == null ? '' : String(s1);
  s2 = s2 == null ? '' : String(s2);
  var n = s1.length;
  var m = s2.length;
  if (!isFiniteNumber(n) || !isFiniteNumber(m)) return null;
  if (n === 0 && m === 0) return [];
  if (n * m > 200000) return null;
  if (n > 4000 || m > 4000) return null;
  var result = [];
  var matrix = createMatrix(n + 1, m + 1, 0);
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) matrix[i][j] = matrix[i - 1][j - 1] + 1;
      else matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  var i = n;
  var j = m;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      result.push({ type: 'eq', value: s1[i - 1] });
      i--; j--;
    } else if (matrix[i - 1][j] >= matrix[i][j - 1]) {
      result.push({ type: 'del', value: s1[i - 1] });
      i--;
    } else {
      result.push({ type: 'add', value: s2[j - 1] });
      j--;
    }
  }
  while (i > 0) { result.push({ type: 'del', value: s1[i - 1] }); i--; }
  while (j > 0) { result.push({ type: 'add', value: s2[j - 1] }); j--; }
  result.reverse();
  return result;
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  var n = a.length;
  var m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;
  var dp = createMatrix(n + 1, m + 1, 0);
  for (var i = 0; i <= n; i++) dp[i][0] = i;
  for (var j = 0; j <= m; j++) dp[0][j] = j;
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= m; j++) {
      var cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[n][m];
}

function partsToHtml(parts, side) {
  if (!parts) return null;
  return parts.map(function (p) {
    if (p.type === 'eq') return escapeHtml(p.value);
    if (side === 'left' && p.type === 'add') return '';
    if (side === 'right' && p.type === 'del') return '';
    var cls = p.type === 'add' ? 'diff-add' : 'diff-del';
    return '<span class="' + cls + '">' + escapeHtml(p.value) + '</span>';
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (s) {
    return ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]);
  });
}

function loadSample() {
  dom.leftInput.value = JSON.stringify({
    "type": "structure",
    "fields": {
      "Номер": "000000123",
      "Дата и время": "2026-02-08",
      "Контрагент": "ООО Ромашка — Дистрибьюция и сервисное обслуживание оборудования для офисов и складов",
      "Комментарий": "Поставка по договору 458/2025 от 12.01.2026. Условия: предоплата 50%, остаток в течение 10 рабочих дней после отгрузки. Дополнительно: согласовать график доставки с логистом.",
      "Товары": {
        "type": "table",
        "name": "Товары и услуги",
        "columns": ["Номенклатура", "Количество", "Цена"],
        "rows": [
          { "id": "2f1a9c", "cells": { "Номенклатура": "Кофе", "Количество": "10", "Цена": "350" } },
          { "id": "9b88d1", "cells": { "Номенклатура": "Чай", "Количество": "5", "Цена": "200" } },
          { "id": "L-001", "cells": { "Номенклатура": "Стол офисный", "Количество": "2", "Цена": "12500" } }
        ]
      },
      "ШирокаяТаблица": {
        "type": "table",
        "columns": ["Колонка1", "Колонка2", "Колонка3", "Колонка4", "Колонка5", "Колонка6", "Колонка7", "Колонка8", "Колонка9", "Колонка10", "Колонка11", "Колонка12", "Колонка13", "Колонка14"],
        "rows": [
          {
            "id": "A-001",
            "cells": {
              "Колонка1": "A1",
              "Колонка2": "A2",
              "Колонка3": "A3",
              "Колонка4": "A4",
              "Колонка5": "A5",
              "Колонка6": "A6",
              "Колонка7": "A7",
              "Колонка8": "A8",
              "Колонка9": "A9",
              "Колонка10": "A10",
              "Колонка11": "A11",
              "Колонка12": "A12",
              "Колонка13": "A13",
              "Колонка14": "A14"
            }
          }, {
            "id": "A-002",
            "cells": {
              "Колонка1": "B1",
              "Колонка2": "B2",
              "Колонка3": "B3",
              "Колонка4": "B4",
              "Колонка5": "B5",
              "Колонка6": "B6",
              "Колонка7": "B7",
              "Колонка8": "B8",
              "Колонка9": "B9",
              "Колонка10": "B10",
              "Колонка11": "B11",
              "Колонка12": "B12",
              "Колонка13": "B13",
              "Колонка14": "B14"
            }
          }
        ]
      }
    }
  }, null, 2);
  dom.rightInput.value = JSON.stringify({
    "$format": "1c-diff-json-1",
    "type": "structure",
    "fields": {
      "Номер": "000000123",
      "Дата": "2026-02-09",
      "Контрагент": "ООО Ромашка — Дистрибьюция и сервисное обслуживание оборудования для офисов и складов",
      "Комментарий": "Поставка по договору 458/2025 от 12.01.2026. Условия: предоплата 50%, остаток в течение 10 рабочих дней после отгрузки. Дополнительно: доставку перенесли на пятницу, связаться с складом.",
      "Товары": {
        "type": "table",
        "columns": ["Номенклатура", "Количество", "Цена"],
        "rows": [
          { "id": "2f1a9c", "cells": { "Номенклатура": "Кофе", "Количество": "12", "Цена": "350" } },
          { "id": "9b88d1", "cells": { "Номенклатура": "Чай", "Количество": "5", "Цена": "220" } },
          { "id": "77a221", "cells": { "Номенклатура": "Сахар", "Количество": "3", "Цена": "90" } },
          { "id": "L-001", "cells": { "Номенклатура": "Принтер лазерный", "Количество": "1", "Цена": "54000" } }
        ]
      },
      "ШирокаяТаблица": {
        "type": "table",
        "columns": ["Колонка1", "Колонка2", "Колонка3", "Колонка4", "Колонка5", "Колонка6", "Колонка7", "Колонка8", "Колонка9", "Колонка10", "Колонка11", "Колонка12", "Колонка13", "Колонка14"],
        "rows": [
          {
            "id": "A-001",
            "cells": {
              "Колонка1": "C1",
              "Колонка2": "C2",
              "Колонка3": "C3",
              "Колонка4": "C4",
              "Колонка5": "C5",
              "Колонка6": "C6",
              "Колонка7": "C7",
              "Колонка8": "C8",
              "Колонка9": "C9",
              "Колонка10": "C10",
              "Колонка11": "C11",
              "Колонка12": "C12",
              "Колонка13": "C13",
              "Колонка14": "C14"
            }
          }, {
            "id": "A-002",
            "cells": {
              "Колонка1": "A1",
              "Колонка2": "A2",
              "Колонка3": "A3",
              "Колонка4": "A4",
              "Колонка5": "A5-changed",
              "Колонка6": "A6",
              "Колонка7": "A7",
              "Колонка8": "A8",
              "Колонка9": "A9",
              "Колонка10": "A10",
              "Колонка11": "A11",
              "Колонка12": "A12",
              "Колонка13": "A13",
              "Колонка14": "A14"
            }
          },
          {
            "id": "A-003",
            "cells": {
              "Колонка1": "B1",
              "Колонка2": "B2",
              "Колонка3": "B3",
              "Колонка4": "B4",
              "Колонка5": "B5",
              "Колонка6": "B6",
              "Колонка7": "B7",
              "Колонка8": "B8",
              "Колонка9": "B9",
              "Колонка10": "B10",
              "Колонка11": "B11",
              "Колонка12": "B12",
              "Колонка13": "B13",
              "Колонка14": "B14"
            }
          }
        ]
      }
    }
  }, null, 2);
  compare();
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    var out = {};
    Object.keys(value).sort().forEach(function (k) {
      out[k] = sortKeys(value[k]);
    });
    return out;
  }
  return value;
}

function parseJson(text) {
  if (!text.trim()) return null;
  try {
    var obj = JSON.parse(text);
    return { node: normalizeValue(obj), error: null };
  } catch (e) {
    console.warn('Ошибка JSON: ' + e.message);
    return { node: null, error: e.message || 'Ошибка JSON' };
  }
}

function normalizeValue(value) {
  if (value && typeof value === 'object') {
    if (value.type === 'table') return normalizeTable(value);
    if (value.type === 'structure') {
      var fields = value.fields || {};
      var normalizedFields = {};
      Object.keys(fields).forEach(function (k) {
        normalizedFields[k] = normalizeValue(fields[k]);
      });
      return { kind: 'structure', fields: normalizedFields };
    }
    if (Array.isArray(value)) return { kind: 'value', value: value };
    var normalizedFields = {};
    Object.keys(value).forEach(function (k) {
      normalizedFields[k] = normalizeValue(value[k]);
    });
    return { kind: 'structure', fields: normalizedFields };
  }
  return { kind: 'value', value: value };
}

function normalizeTable(value) {
  var columns = Array.isArray(value.columns) ? value.columns.slice() : [];
  var rows = Array.isArray(value.rows) ? value.rows : [];
  var normalizedRows = rows.map(function (row, index) {
    return normalizeRow(row, index, columns);
  });
  if (!columns.length) {
    var set = new SetStore();
    normalizedRows.forEach(function (r) {
      Object.keys(r.cells).forEach(function (c) {
        if (!set.has(c)) {
          set.add(c);
          columns.push(c);
        }
      });
    });
  }
  var name = typeof value.name === 'string' ? value.name : typeof value.title === 'string' ? value.title : null;
  var hasExplicitIds = normalizedRows.some(function (r) {
    return r.hasExplicitId;
  });
  return { kind: 'table', columns: columns, rows: normalizedRows, name: name, hasExplicitIds: hasExplicitIds };
}

function normalizeRow(row, index, columns) {
  var explicit = row && (row.id !== undefined || row.$id !== undefined || row.key !== undefined);
  var displayId = explicit
    ? String(row.id != null ? row.id : row.$id != null ? row.$id : row.key)
    : String(index + 1);
  var cells = row && row.cells != null ? row.cells : row && row.values != null ? row.values : row;
  if (Array.isArray(cells)) {
    var obj = {};
    columns.forEach(function (c, i) {
      obj[c] = cells[i];
    });
    cells = obj;
  }
  if (!cells || typeof cells !== 'object') cells = {};
  var normalized = {};
  Object.keys(cells).forEach(function (k) {
    normalized[k] = normalizeValue(cells[k]);
  });
  return { id: displayId, displayId: displayId, cells: normalized, hasExplicitId: explicit };
}

function stringifyValue(node) {
  if (!node) return '';
  if (node.kind === 'value') {
    if (node.value === null) return 'null';
    if (node.value === undefined) return 'undefined';
    if (typeof node.value === 'string') return node.value;
    return String(node.value);
  }
  if (node.kind === 'table') {
    var rows = node.rows ? node.rows.length : 0;
    var cols = node.columns ? node.columns.length : 0;
    return '[table ' + rows + 'x' + cols + ']';
  }
  if (node.kind === 'structure') {
    return shorten(JSON.stringify(nodeToPlain(node)), 200);
  }
  return shorten(JSON.stringify(node), 200);
}

function nodeToPlain(node) {
  if (!node || typeof node !== 'object') return node;
  if (node.kind === 'value') return node.value;
  if (node.kind === 'table') {
    return {
      type: 'table',
      columns: node.columns || [],
      rows: (node.rows || []).map(function (r) {
        var cells = {};
        Object.keys(r.cells || {}).forEach(function (k) {
          cells[k] = nodeToPlain(r.cells[k]);
        });
        return { id: r.id, cells: cells };
      })
    };
  }
  if (node.kind === 'structure') {
    var out = {};
    Object.keys(node.fields || {}).forEach(function (k) {
      out[k] = nodeToPlain(node.fields[k]);
    });
    return out;
  }
  return node;
}

function shorten(str, max) {
  if (typeof str !== 'string') return String(str);
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

function cellTextFromRow(row, column) {
  if (!row || !row.cells) return '';
  var v = row.cells[column];
  if (v && typeof v === 'object') {
    if (v.kind) return stringifyValue(v);
    try { return JSON.stringify(v); } catch (_) { return String(v); }
  }
  if (v === null) return 'null';
  if (v === undefined) return '';
  return String(v);
}

function collect(node, path, accFields, accTables) {
  if (!node) return;
  if (node.kind === 'structure') {
    Object.keys(node.fields).forEach(function (name) {
      var nextPath = path ? (path + '.' + name) : name;
      var child = node.fields[name];
      if (child.kind === 'table') accTables.set(nextPath, child);
      else if (child.kind === 'structure') collect(child, nextPath, accFields, accTables);
      else accFields.set(nextPath, stringifyValue(child));
    });
  } else if (node.kind === 'table') {
    accTables.set(path || 'ROOT', node);
  } else {
    accFields.set(path || 'ROOT', stringifyValue(node));
  }
}

function compare() {
  var leftParsed = parseJson(dom.leftInput.value);
  var rightParsed = parseJson(dom.rightInput.value);
  var leftRoot = leftParsed && leftParsed.node != null ? leftParsed.node : null;
  var rightRoot = rightParsed && rightParsed.node != null ? rightParsed.node : null;
  var errors = [];
  if (leftParsed && leftParsed.error) errors.push('Левая версия: ' + leftParsed.error);
  if (rightParsed && rightParsed.error) errors.push('Правая версия: ' + rightParsed.error);
  if (errors.length) {
    dom.jsonError.textContent = errors.join(' | ');
    dom.jsonError.classList.remove('hidden');
  } else {
    dom.jsonError.textContent = '';
    dom.jsonError.classList.add('hidden');
  }
  if (!leftRoot && !rightRoot) {
    dom.structBody.innerHTML = '';
    dom.tablesBody.innerHTML = '';
    return;
  }
  var leftFields = new MapStore();
  var rightFields = new MapStore();
  var leftTables = new MapStore();
  var rightTables = new MapStore();
  if (leftRoot) collect(leftRoot, '', leftFields, leftTables);
  if (rightRoot) collect(rightRoot, '', rightFields, rightTables);

  var fieldRows = buildFieldRows(leftFields, rightFields);
  var tableDiffs = buildTableDiffs(leftTables, rightTables);

  renderStructures(fieldRows);
  renderTables(tableDiffs);
}

function zeroCounts() {
  return { changed: 0, added: 0, removed: 0, unchanged: 0 };
}

function buildFieldRows(left, right) {
  var keys = [];
  var keySet = new SetStore();
  left.keys().forEach(function (key) {
    if (!keySet.has(key)) {
      keySet.add(key);
      keys.push(key);
    }
  });
  right.keys().forEach(function (key) {
    if (!keySet.has(key)) {
      keySet.add(key);
      keys.push(key);
    }
  });
  var rows = [];
  keys.forEach(function (key) {
    var l = left.has(key) ? left.get(key) : null;
    var r = right.has(key) ? right.get(key) : null;
    var status = 'unchanged';
    if (l === null && r !== null) status = 'added';
    else if (l !== null && r === null) status = 'removed';
    else if (l !== r) status = 'changed';
    rows.push({ key: key, l: l, r: r, status: status });
  });
  return rows.sort(function (a, b) {
    return a.key.localeCompare(b.key);
  });
}

function buildTableDiffs(left, right) {
  var paths = [];
  var pathSet = new SetStore();
  left.keys().forEach(function (path) {
    if (!pathSet.has(path)) {
      pathSet.add(path);
      paths.push(path);
    }
  });
  right.keys().forEach(function (path) {
    if (!pathSet.has(path)) {
      pathSet.add(path);
      paths.push(path);
    }
  });
  var diffs = [];
  paths.forEach(function (path) {
    var lt = left.has(path) ? left.get(path) : null;
    var rt = right.has(path) ? right.get(path) : null;
    var title = (lt && lt.name) || (rt && rt.name) || null;
    var columns = mergeColumns(lt && lt.columns, rt && rt.columns);
    var rows = alignRows((lt && lt.rows) || [], (rt && rt.rows) || [], columns, path);
    diffs.push({ path: path, title: title, columns: columns, rows: rows });
  });
  return diffs.sort(function (a, b) {
    return a.path.localeCompare(b.path);
  });
}

function mergeColumns(a, b) {
  var cols = [];
  var set = new SetStore();
  (a || []).forEach(function (c) {
    if (!set.has(c)) { set.add(c); cols.push(c); }
  });
  (b || []).forEach(function (c) {
    if (!set.has(c)) { set.add(c); cols.push(c); }
  });
  return cols;
}

function mapRows(table, columns) {
  var map = new MapStore();
  if (!table) return map;
  table.rows.forEach(function (row, index) {
    var id = row.id || String(index + 1);
    var cells = {};
    columns.forEach(function (c) {
      var node = row.cells[c];
      cells[c] = node ? stringifyValue(node) : null;
    });
    map.set(id, { id: id, cells: cells });
  });
  return map;
}

function alignRows(leftRows, rightRows, columns, path) {
  var n = leftRows.length;
  var m = rightRows.length;
  if (n * m > 50000) {
    logDecision(path, n + 'x' + m, 'fallback', 'слишком большая матрица для выравнивания');
    return alignRowsFallback(leftRows, rightRows, columns);
  }
  var dp = createMatrix(n + 1, m + 1, 0);
  var move = createMatrix(n + 1, m + 1, '');
  var delCost = 1;
  var insCost = 1;
  dp[0][0] = 0;
  for (var i = 1; i <= n; i++) {
    dp[i][0] = dp[i - 1][0] + delCost;
    move[i][0] = 'D';
  }
  for (var j = 1; j <= m; j++) {
    dp[0][j] = dp[0][j - 1] + insCost;
    move[0][j] = 'I';
  }
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= m; j++) {
      var l = leftRows[i - 1];
      var r = rightRows[j - 1];
      var sim = similarityScore(l, r, columns);
      var subCost = sim.same ? 0 : sim.similar ? sim.ratio : 2;
      var del = dp[i - 1][j] + delCost;
      var ins = dp[i][j - 1] + insCost;
      var sub = dp[i - 1][j - 1] + subCost;
      var best = Math.min(del, ins, sub);
      dp[i][j] = best;
      move[i][j] = best === sub ? 'S' : best === del ? 'D' : 'I';
    }
  }
  var rows = [];
  var i = n;
  var j = m;
  while (i > 0 || j > 0) {
    var mv = move[i][j];
    if (mv === 'S') {
      var l = leftRows[i - 1];
      var r = rightRows[j - 1];
      var sim = similarityScore(l, r, columns);
      var id = l && l.displayId != null
        ? l.displayId
        : r && r.displayId != null
          ? r.displayId
          : String(i);
      var groupId = 'g-' + i + '-' + j;
      if (sim.same) {
        logDecision(path, id, 'unchanged', 'совпало по содержимому. ratio: ' + sim.ratio);
        rows.push({ id: id, l: l, r: r, status: 'unchanged', groupId: groupId });
      } else if (sim.similar) {
        logDecision(path, id, 'changed', 'сопоставлено по близости. ratio: ' + sim.ratio);
        rows.push({ id: id, l: l, r: r, status: 'changed', groupId: groupId });
      } else {
        logDecision(path, id, 'removed+added', 'слишком отличается после выравнивания. ratio: ' + sim.ratio);
        var pairId = 'pair-' + i + '-' + j;
        rows.push({ id: id, l: l, r: null, status: 'removed', pair: r, groupId: pairId });
        rows.push({ id: id, l: null, r: r, status: 'added', pair: l, groupId: pairId });
      }
      i--; j--;
    } else if (mv === 'D') {
      var l = leftRows[i - 1];
      var id = l && l.displayId != null ? l.displayId : String(i);
      logDecision(path, id, 'removed', 'удалено при выравнивании');
      rows.push({ id: id, l: l, r: null, status: 'removed', groupId: 'g-' + i + '-d' });
      i--;
    } else {
      var r = rightRows[j - 1];
      var id = r && r.displayId != null ? r.displayId : String(j);
      logDecision(path, id, 'added', 'добавлено при выравнивании');
      rows.push({ id: id, l: null, r: r, status: 'added', groupId: 'g-' + j + '-i' });
      j--;
    }
  }
  return rows.reverse();
}

function alignRowsFallback(leftRows, rightRows, columns) {
  var leftMap = new MapStore();
  var rightMap = new MapStore();
  leftRows.forEach(function (row, index) {
    var id = row.displayId != null ? row.displayId : row.id != null ? row.id : String(index + 1);
    leftMap.set(id, row);
  });
  rightRows.forEach(function (row, index) {
    var id = row.displayId != null ? row.displayId : row.id != null ? row.id : String(index + 1);
    rightMap.set(id, row);
  });
  var ids = [];
  var idSet = new SetStore();
  leftRows.forEach(function (row, index) {
    var id = row.displayId != null ? row.displayId : row.id != null ? row.id : String(index + 1);
    if (!idSet.has(id)) {
      idSet.add(id);
      ids.push(id);
    }
  });
  rightRows.forEach(function (row, index) {
    var id = row.displayId != null ? row.displayId : row.id != null ? row.id : String(index + 1);
    if (!idSet.has(id)) {
      idSet.add(id);
      ids.push(id);
    }
  });
  return ids.map(function (id, i) {
    var l = leftMap.has(id) ? leftMap.get(id) : null;
    var r = rightMap.has(id) ? rightMap.get(id) : null;
    var status = 'unchanged';
    if (l && r && rowsEqual(l, r, columns)) status = 'unchanged';
    else if (l && r) status = 'changed';
    else if (l && !r) status = 'removed';
    else status = 'added';
    return { id: id, l: l, r: r, status: status, groupId: 'fallback-' + i };
  });
}

function similarityScore(l, r, columns) {
  if (!l || !r) return { same: false, similar: false, ratio: 1 };
  if (rowsEqual(l, r, columns)) return { same: true, similar: true, ratio: 0 };
  var left = getRowSignature(l, columns);
  var right = getRowSignature(r, columns);
  var maxLen = Math.max(left.length, right.length);
  if (maxLen === 0) return { same: true, similar: true };
  if (maxLen > 300) {
    var sim = tokenSimilarity(left, right);
    return { same: false, similar: sim >= 0.6, ratio: sim};
  }
  var dist = levenshteinDistance(left, right);
  var ratio = dist / maxLen;
  return { same: false, similar: ratio <= 0.4, ratio: ratio };
}

function rowsEqual(l, r, columns) {
  if (!l || !r) return false;
  for (var i = 0; i < columns.length; i++) {
    var c = columns[i];
    var leftVal = cellTextFromRow(l, c);
    var rightVal = cellTextFromRow(r, c);
    if (leftVal !== rightVal) return false;
  }
  return true;
}

function getRowSignature(row, columns) {
  if (!row) return '';
  var key = columns.join('\u0001');
  var byCols = row.__sigCache;
  if (!byCols) {
    byCols = createDict();
    row.__sigCache = byCols;
  }
  if (dictHas(byCols, key)) return byCols[key];
  var sig = rowSignature(row, columns);
  byCols[key] = sig;
  return sig;
}

function rowSignature(row, columns) {
  return columns.map(function (c) {
    return cellTextFromRow(row, c);
  }).join('|');
}

function tokenSimilarity(a, b) {
  var left = tokenize(a);
  var right = tokenize(b);
  var leftKeys = Object.keys(left);
  var rightKeys = Object.keys(right);
  if (leftKeys.length === 0 && rightKeys.length === 0) return 1;
  var inter = 0;
  for (var i = 0; i < leftKeys.length; i++) {
    var t = leftKeys[i];
    if (dictHas(right, t)) inter++;
  }
  var union = leftKeys.length + rightKeys.length - inter;
  return union === 0 ? 0 : inter / union;
}

function tokenize(text) {
  var out = createDict();
  String(text).toLowerCase().split(/[^\w\u0400-\u04FF]+/).forEach(function (t) {
    if (t) out[t] = true;
  });
  return out;
}

function logDecision(path, id, status, reason) {
  try {
    var prefix = '[1C-DIFF] ' + path + ' :: ' + id;
    console.log(prefix + ' -> ' + status + '. Причина: ' + reason);
  } catch (_) {
    // ignore logging errors in restricted environments
  }
}

function countStatuses(rows) {
  var counts = zeroCounts();
  rows.forEach(function (r) {
    counts[r.status]++;
  });
  return counts;
}

function renderStructures(rows) {
  dom.structBody.innerHTML = '';
  if (!rows.length) return;
  var tableWrap = document.createElement('div');
  tableWrap.className = 'table-wrap';
  var table = document.createElement('table');
  table.className = 'diff-table struct-table';
  table.innerHTML = '';
  var tbody = document.createElement('tbody');
  rows.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.className = 'row-' + row.status;
    var tdPath = document.createElement('td');
    tdPath.className = 'table-header';
    tdPath.textContent = row.key;
    var tdLeft = document.createElement('td');
    tdLeft.className = 'value' + (row.l === null ? ' empty' : '');
    var tdRight = document.createElement('td');
    tdRight.className = 'value' + (row.r === null ? ' empty' : '');
    if (row.status === 'changed') {
      var parts = diffParts(row.l || '', row.r || '');
      if (parts) {
        tdLeft.innerHTML = partsToHtml(parts, 'left');
        tdRight.innerHTML = partsToHtml(parts, 'right');
      } else {
        tdLeft.textContent = row.l != null ? row.l : '—';
        tdRight.textContent = row.r != null ? row.r : '—';
      }
    } else {
      tdLeft.textContent = row.l != null ? row.l : '—';
      tdRight.textContent = row.r != null ? row.r : '—';
    }
    tr.appendChild(tdPath);
    tr.appendChild(tdLeft);
    tr.appendChild(tdRight);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  dom.structBody.appendChild(tableWrap);
}

function renderTables(diffs) {
  dom.tablesBody.innerHTML = '';
  diffs.forEach(function (tableDiff) {
    var group = document.createElement('div');
    group.className = 'group table-group';
    group.dataset.open = 'true';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'group-toggle';
    var label = tableDiff.title
      ? (tableDiff.title + ' (' + tableDiff.path + ')')
      : ('Таблица: ' + tableDiff.path);
    toggle.textContent = label;
    toggle.addEventListener('click', function () {
      group.dataset.open = group.dataset.open === 'true' ? 'false' : 'true';
    });
    group.appendChild(toggle);

    var groupTotals = countStatuses(tableDiff.rows);
    var body = document.createElement('div');
    body.className = 'group-body';
    body.appendChild(renderGroupSummary(groupTotals));

    var wrap = document.createElement('div');
    wrap.className = 'table-wrap';

    var table = document.createElement('table');
    table.className = 'diff-table';
    var thead = document.createElement('thead');
    thead.className = 'table-header';
    var headRow = document.createElement('tr');
    var thId = document.createElement('th');
    thId.textContent = 'ID';
    headRow.appendChild(thId);
    tableDiff.columns.forEach(function (c) {
      var th = document.createElement('th');
      th.textContent = c;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    for (var i = 0; i < tableDiff.rows.length; i++) {
      var row = tableDiff.rows[i];
      var next = tableDiff.rows[i + 1];
      if (row.status === 'removed' && row.pair && next && next.status === 'added' && next.groupId === row.groupId) {
        tbody.appendChild(renderTableRow(row, tableDiff.columns));
        tbody.appendChild(renderTableRow(next, tableDiff.columns));
        i++;
      } else if (row.status === 'changed') {
        tbody.appendChild(renderTableRowCombined(row, tableDiff.columns));
      } else {
        tbody.appendChild(renderTableRow(row, tableDiff.columns));
      }
      var nextRow = tableDiff.rows[i + 1];
      if (nextRow && nextRow.groupId !== row.groupId) {
        tbody.appendChild(renderSpacerRow(tableDiff.columns.length + 1));
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    body.appendChild(wrap);
    group.appendChild(body);
    dom.tablesBody.appendChild(group);
  });
}

function renderTableRow(row, columns, groupClass) {
  var tr = document.createElement('tr');
  tr.className = 'row-' + row.status;
  if (row.pair && row.status === 'removed') tr.className += ' pair-top';
  if (row.pair && row.status === 'added') tr.className += ' pair-bottom';
  if (groupClass) tr.className += ' ' + groupClass;
  var tdId = document.createElement('td');
  tdId.className = 'field-path';
  tdId.textContent = row.id;
  tr.appendChild(tdId);
  columns.forEach(function (c) {
    var td = document.createElement('td');
    td.className = 'value';
    var val = cellTextFromRow(row.l || row.r, c);
    if ((row.status === 'removed' || row.status === 'added') && row.pair) {
      var leftVal = row.l ? cellTextFromRow(row.l, c) : cellTextFromRow(row.pair, c);
      var rightVal = row.r ? cellTextFromRow(row.r, c) : cellTextFromRow(row.pair, c);
      var parts = diffParts(leftVal || '', rightVal || '');
      if (parts) {
        td.innerHTML = row.status === 'removed' ? partsToHtml(parts, 'left') : partsToHtml(parts, 'right');
      } else {
        td.textContent = val || '—';
      }
    } else {
      td.textContent = val || '—';
    }
    tr.appendChild(td);
  });
  return tr;
}

function renderTableRowCombined(row, columns, groupClass) {
  var tr = document.createElement('tr');
  tr.className = 'row-' + row.status;
  if (groupClass) tr.className += ' ' + groupClass;
  var tdId = document.createElement('td');
  tdId.className = 'field-path';
  tdId.textContent = row.id;
  tr.appendChild(tdId);
  columns.forEach(function (c) {
    var td = document.createElement('td');
    td.className = 'value';
    var leftVal = row.l ? cellTextFromRow(row.l, c) : '';
    var rightVal = row.r ? cellTextFromRow(row.r, c) : '';
    var parts = diffParts(leftVal || '', rightVal || '');
    if ((leftVal || '') === (rightVal || '')) {
      td.className += ' cell-compare-single';
      td.textContent = leftVal || rightVal || '—';
    } else {
      var left = document.createElement('div');
      left.className = 'cell-left';
      var right = document.createElement('div');
      right.className = 'cell-right';
      if (parts) {
        left.innerHTML = partsToHtml(parts, 'left');
        right.innerHTML = partsToHtml(parts, 'right');
      } else {
        left.textContent = leftVal || '—';
        right.textContent = rightVal || '—';
      }
      td.className += ' cell-compare';
      td.appendChild(left);
      td.appendChild(right);
    }
    tr.appendChild(td);
  });
  return tr;
}

function renderSpacerRow(colspan) {
  var tr = document.createElement('tr');
  tr.className = 'row-spacer';
  var td = document.createElement('td');
  td.colSpan = colspan;
  tr.appendChild(td);
  return tr;
}

function renderGroupSummary(counts) {
  var summary = document.createElement('div');
  summary.className = 'group-summary';
  summary.innerHTML =
    '<span class="chip changed"><strong>' + counts.changed + '</strong> изменено</span>' +
    '<span class="chip added"><strong>' + counts.added + '</strong> добавлено</span>' +
    '<span class="chip removed"><strong>' + counts.removed + '</strong> удалено</span>' +
    '<span class="chip unchanged"><strong>' + counts.unchanged + '</strong> без изменений</span>';
  return summary;
}

function init() {
  dom.leftInput = byId('leftInput');
  dom.rightInput = byId('rightInput');
  dom.structBody = byId('structBody');
  dom.tablesBody = byId('tablesBody');
  dom.jsonError = byId('jsonError');
  dom.infoBtn = byId('infoBtn');
  dom.infoPanel = byId('infoPanel');

  if (!dom.leftInput || !dom.rightInput) return;

  if (dom.infoBtn) dom.infoBtn.addEventListener('click', toggleInfoPanel);

  exposeApi();
}

init();
