// Google Sheets -> Extensions -> Apps Script. Set Script Property WEBHOOK_SECRET.
// Deploy as Web App: Execute as Me, Access Anyone. Do NOT share the secret publicly.
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!secret || d.secret !== secret) throw new Error('Unauthorized');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');
      if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp','Name','SFU email','Experience','Interests','Availability','Organizing']);
      // Avoid interpreting untrusted values as spreadsheet formulas.
      const safe = v => "'" + String(v == null ? '' : v).replace(/[\r\n]+/g, ' ');
      sheet.appendRow([new Date(), safe(d.name), safe(d.email), safe(d.experience), safe((d.interests||[]).join(', ')), safe((d.availability||[]).join(', ')), safe(d.organize)]);
    } finally { lock.releaseLock(); }
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false})).setMimeType(ContentService.MimeType.JSON);
  }
}
