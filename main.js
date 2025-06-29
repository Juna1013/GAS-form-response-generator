// 設定値
const FORM_URL = "GoogleFormのリンク";
const SUBMISSION_COUNT_PER_MINUTE = 100; // 1分あたりの送信回数
const DELAY_MILLIS = 60000 / SUBMISSION_COUNT_PER_MINUTE; // 送信間隔 (ミリ秒)

// Googleフォームに回答を送信するメイン関数
function sendFormResponses() {
  const form = FormApp.openByUrl(FORM_URL);
  
  for (let i = 0; i < SUBMISSION_COUNT_PER_MINUTE; i++) {
    const response = form.createResponse();
    
    // 1. 「名前」の質問に回答 (テキスト形式)
    const nameItem = form.getItemsByName("名前")[0].asTextItem();
    response.withItemResponse(nameItem.createResponse("Test" + (i + 1))); 

    // 2. 「日付」の質問に回答 (日付形式)
    const dateItem = form.getItemsByName("日付")[0].asDateItem();
    const today = new Date(); 
    response.withItemResponse(dateItem.createResponse(today));
    
    response.submit();
    Logger.log(`回答を送信しました (${i + 1}/${SUBMISSION_COUNT_PER_MINUTE})`);

    // 最後の送信では待機しない
    if (i < SUBMISSION_COUNT_PER_MINUTE - 1) {
      Utilities.sleep(DELAY_MILLIS); // 次の送信まで待機
    }
  }
  Logger.log(`${SUBMISSION_COUNT_PER_MINUTE}件の回答送信が完了しました。`);
}


// トリガーを設定するための関数 (手動実行用)
function setupTrigger() {
  // 既存のトリガーを削除（重複防止のため）
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getHandlerFunction() == "sendFormResponses") {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
  }
  
  // 1分ごとにsendFormResponses関数を実行するトリガーを設定
  ScriptApp.newTrigger("sendFormResponses")
      .timeBased()
      .everyMinutes(1) // 1分ごとに実行
      .create();
  
  Logger.log("1分ごとにフォーム回答を送信するトリガーを設定しました。");
}

// 設定済みのトリガーを削除する関数
function deleteTrigger() {
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getHandlerFunction() == "sendFormResponses") {
      ScriptApp.deleteTrigger(allTriggers[i]);
      Logger.log("トリガーを削除しました。");
      return;
    }
  }
  Logger.log("対象のトリガーは見つかりませんでした。");
}
