/**
 * Google E-Tablolar > Uzantılar > Apps Script içine yapıştırın.
 * Bu dosya GitHub Pages tarafından çalıştırılmaz; kodu Google'da dağıtmanız gerekir.
 */
const SHEET_NAME = 'Yanıtlar';
const HEADERS = ['Davet ID', 'Kayıt zamanı', 'Ad', 'Etkinlik', 'Tarih', 'Saat'];
const ACTIVITY_LABELS = {
  yemek: 'Yemek',
  kahve: 'Kahve',
  'gol-yuruyusu': 'Göl yürüyüşü',
  sinema: 'Sinema'
};

function doGet() {
  return ContentService.createTextOutput('Date daveti kayıt noktası hazır.');
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const id = String(p.id || '').trim();
    const activity = String(p.activity || '').trim();
    const date = String(p.date || '').trim();
    const time = String(p.time || '').trim();
    const name = String(p.name || '').trim().slice(0, 40);

    if (!/^[a-zA-Z0-9-]{8,100}$/.test(id) ||
        !Object.prototype.hasOwnProperty.call(ACTIVITY_LABELS, activity) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return ContentService.createTextOutput('Geçersiz veri.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
      const row = [id, new Date(), safeText(name), ACTIVITY_LABELS[activity], date, time];
      const count = sheet.getLastRow() - 1;
      const ids = count > 0 ? sheet.getRange(2, 1, count, 1).getValues().flat() : [];
      const match = ids.findIndex(existing => String(existing) === id);
      if (match >= 0) sheet.getRange(match + 2, 1, 1, row.length).setValues([row]);
      else sheet.appendRow(row);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return ContentService.createTextOutput('OK');
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput('Kayıt hatası.');
  }
}

// E-Tablolar'da kullanıcı metninin formül olarak yorumlanmasını engeller.
function safeText(value) {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}
