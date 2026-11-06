**
 * Этот код должен быть вставлен в Google Apps Script,
 * привязанный к вашей Google Таблице
 * (Расширения → Apps Script → замените содержимое Code.gs на это).
 *
 * После вставки/изменения обязательно пересоздайте деплой:
 * Deploy → Manage deployments → ✏️ (edit) → Version: New version → Deploy
 *
 * Настройки деплоя должны быть:
 *   Execute as: Me
 *   Who has access: Anyone
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const params = e.parameter;

    // Если это первая строка — добавляем заголовки автоматически
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Имя', 'Телефон', 'Статус', 'Кол-во гостей', 'Имена гостей', 'Пожелания', 'Язык', 'Дата отправки', 'User-Agent']);
    }

    sheet.appendRow([
      params.name || '',
      params.phone || '',
      params.attending || '',
      params.count || '',
      params.names || '',
      params.needs || '',
      params.lang || '',
      params.submittedAt || new Date().toISOString(),
      params.userAgent || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Нужна для проверки в браузере, что деплой вообще работает
// (откройте /exec ссылку в браузере — должны увидеть "OK")
function doGet(e) {
  return ContentService.createTextOutput('OK');
}

/**
 * ВРЕМЕННАЯ функция только для получения прав доступа к таблице.
 * Если при первом деплое веб-приложение отвечает общей страницей
 * "Error" (герб Apps Script, без деталей) — значит скрипт ещё не
 * авторизован. Запустите эту функцию ОДИН РАЗ вручную:
 *   1. Выберите "authorize" в выпадающем списке функций сверху
 *   2. Нажмите ▶️ Run
 *   3. Пройдите Review permissions → Advanced → Go to ... (unsafe) → Allow
 * После этого doPost начнёт работать без ошибок.
 * Саму функцию можно потом удалить — на URL /exec это не влияет.
 */
function authorize() {
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}
