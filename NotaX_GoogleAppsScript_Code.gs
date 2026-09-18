// NotaX Google Apps Script
// Supports: read, append, update, delete, ringkasan
// Deploy as Web App from Google Apps Script.
// You may also store this file in GitHub as: /apps-script/Code.gs

function doGet(e) {
  try {
    var p = e.parameter || {};

    if (p.action === 'read') {
      return renderReadHtml_();
    }

    if (p.action === 'delete') {
      return handleDelete_(p);
    }

    if (p.action === 'update' && p.data) {
      return handleUpdate_(JSON.parse(p.data));
    }

    if (p.data) {
      appendCatatan_(JSON.parse(p.data));
      return jsonOut_({status:'ok'});
    }

    updateRingkasan_();
    return jsonOut_({
      status:'ok',
      version:'v20-edit-pdf-mobile',
      rows: readRows_()
    });

  } catch (err) {
    return jsonOut_({
      status:'error',
      message: err.toString()
    });
  }
}

function handleDelete_(p) {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(p.id)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }

  updateRingkasan_();
  return jsonOut_({status:'ok', action:'deleted'});
}

function handleUpdate_(data) {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(data.id)) {

      sheet.getRange(i + 1, 1, 1, 10).setValues([[
        data.id,
        data.tanggal,
        data.beli_apa,
        Number(data.total) || 0,
        data.pakai_uang,
        data.project,
        data.ada_bukti_nota,
        data.foto_url || '',
        data.catatan || '',
        new Date()
      ]]);

      updateRingkasan_();

      return jsonOut_({
        status:'ok',
        action:'updated'
      });
    }
  }

  // Kalau ID tidak ditemukan, tambahkan sebagai data baru
  appendCatatan_(data);

  return jsonOut_({
    status:'ok',
    action:'inserted'
  });
}

function renderReadHtml_() {
  updateRingkasan_();

  var payload = JSON.stringify({
    status:'ok',
    rows: readRows_()
  });

  var html =
    '<script>window.top.postMessage(' +
    payload +
    ', "*");<' +
    '/script>';

  return HtmlService.createHtmlOutput(html);
}

function appendCatatan_(data) {
  var sheet = getSheet_();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'ID',
      'Tanggal',
      'Beli Apa',
      'Total',
      'Pakai Uang',
      'Project',
      'Ada Bukti Nota',
      'Link Foto Nota',
      'Catatan',
      'Waktu Simpan'
    ]);
  }

  sheet.appendRow([
    data.id,
    data.tanggal,
    data.beli_apa,
    Number(data.total) || 0,
    data.pakai_uang,
    data.project,
    data.ada_bukti_nota,
    data.foto_url || '',
    data.catatan || '',
    new Date()
  ]);

  updateRingkasan_();
}

function readRows_() {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];

    // Lewati baris tanpa ID
    if (!row[0]) continue;

    rows.push({
      id: String(row[0]),
      tanggal: row[1],
      beli_apa: row[2],
      total: row[3],
      pakai_uang: row[4],
      project: row[5],
      ada_bukti_nota: row[6],
      foto_url: row[7],
      catatan: row[8]
    });
  }

  return rows;
}

function updateRingkasan_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var catatan = getSheet_();
  var data = catatan.getDataRange().getValues();

  var totals = {};
  var grandTotal = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    // Lewati baris tanpa ID
    if (!row[0]) continue;

    var uang = row[4] || '(tidak diisi)';
    var total = Number(row[3]) || 0;

    totals[uang] = (totals[uang] || 0) + total;
    grandTotal += total;
  }

  var ring = ss.getSheetByName('Ringkasan');

  if (!ring) {
    ring = ss.insertSheet('Ringkasan');
  }

  ring.clear();

  ring.appendRow([
    'Pakai Uang',
    'Total'
  ]);

  Object.keys(totals)
    .sort()
    .forEach(function(k) {
      ring.appendRow([
        k,
        totals[k]
      ]);
    });

  ring.appendRow([
    'Total Semua',
    grandTotal
  ]);

  ring.getRange(1, 1, 1, 2)
    .setFontWeight('bold');

  ring.getRange(
    ring.getLastRow(),
    1,
    1,
    2
  ).setFontWeight('bold');

  ring.autoResizeColumns(1, 2);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Catatan');

  if (!sheet) {
    sheet = ss.insertSheet('Catatan');
  }

  return sheet;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
