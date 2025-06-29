-----

GitHubのREADMEに、このGASプログラムを実行するための手順をまとめるのですね。MARKDOWN形式で、分かりやすくステップバイステップで記述します。

-----

## Googleフォーム自動回答送信プログラム

このプログラムはGoogle Apps Script (GAS) を使用して、指定したGoogleフォームに1分間あたり指定した回数だけ自動で回答を送信します。

-----

## 🚀 実行までの手順

このプログラムを実行するには、以下の手順に従ってください。

### 1\. Googleフォームの準備

まず、回答を送信したいGoogleフォームを用意します。

1.  **新しいGoogleフォームを作成**するか、既存のフォームを開きます。
2.  プログラムから回答を送信するために、少なくとも1つ質問（例: テキスト形式の質問など）があることを確認してください。
3.  フォームの**公開URLを控えておきます**。これはフォームの「送信」ボタンからリンクアイコンをクリックして取得できるURL（`https://docs.google.com/forms/d/e/.../viewform` の形式）です。

### 2\. GoogleスプレッドシートとGASプロジェクトの作成

GASのコードを記述するための環境を準備します。

1.  新しいGoogleスプレッドシートを作成し、名前を付けます（例: `Googleフォーム自動送信スクリプト`）。
2.  スプレッドシートのメニューバーから「**拡張機能**」\>「**Apps Script**」を選択し、GASのスクリプトエディタを開きます。

### 3\. コードの貼り付けと設定

スクリプトエディタに提供されたコードを貼り付け、設定を行います。

1.  スクリプトエディタのデフォルトファイル（`コード.gs` など）を開き、既存のコードをすべて削除します。

2.  以下のコードをコピーして貼り付けます。

    ```javascript
    /**
     * Googleフォームに指定回数、回答を送信するスクリプトです。
     */

    // 設定値
    const FORM_URL = "ここにGoogleフォームのURLを貼り付けてください"; // 例: "https://docs.google.com/forms/d/e/1FAIpQLSc..."
    const SUBMISSION_COUNT_PER_MINUTE = 5; // 1分あたりの送信回数 (例: 5回)
    const DELAY_MILLIS = 60000 / SUBMISSION_COUNT_PER_MINUTE; // 送信間隔 (ミリ秒)

    /**
     * Googleフォームに回答を送信するメイン関数
     */
    function sendFormResponses() {
      const form = FormApp.openByUrl(FORM_URL);
      
      for (let i = 0; i < SUBMISSION_COUNT_PER_MINUTE; i++) {
        const response = form.createResponse();
        
        // TODO: ここを実際にフォームの質問に合わせて編集してください。
        // フォームの質問のタイプと順番に合わせて、item.asXXXItem() と createResponse() の引数を調整してください。
        // 例として、以下に汎用的なテキスト回答を追加します。
        form.getItems().forEach((item, index) => {
          if (item.getType() === FormApp.ItemType.TEXT) {
            response.withItemResponse(item.asTextItem().createResponse("GASからの回答 " + new Date().toLocaleTimeString()));
          }
          // 他の質問タイプにも対応できます (例: CHECKBOX, LIST, RADIOなど)
          // 必要に応じてif文を追加してください
        });


        response.submit();
        Logger.log(`回答を送信しました (${i + 1}/${SUBMISSION_COUNT_PER_MINUTE})`);

        if (i < SUBMISSION_COUNT_PER_MINUTE - 1) {
          Utilities.sleep(DELAY_MILLIS); // 次の送信まで待機
        }
      }
      Logger.log(`${SUBMISSION_COUNT_PER_MINUTE}件の回答送信が完了しました。`);
    }


    /**
     * トリガーを設定するための関数 (手動実行用)
     * この関数を実行することで、sendFormResponses関数が定期的に実行されるようになります。
     */
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

    /**
     * 設定済みのトリガーを削除する関数
     */
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
    ```

3.  **`FORM_URL` の設定**:

      * `const FORM_URL = "ここにGoogleフォームのURLを貼り付けてください";` の部分を、ステップ1で控えておいたGoogleフォームの公開URLに書き換えます。

4.  **`SUBMISSION_COUNT_PER_MINUTE` の設定**:

      * `const SUBMISSION_COUNT_PER_MINUTE = 5;` の `5` を、1分間に送信したい回答数に変更します。

5.  **フォーム回答項目の設定（重要！）**:

      * `sendFormResponses` 関数内の `// TODO: ここを実際にフォームの質問に合わせて編集してください。` の部分を、あなたのGoogleフォームの質問内容に合わせて修正します。
      * 例として、すべてのテキスト質問に自動で回答を生成するコードが含まれていますが、ラジオボタンやチェックボックス、プルダウンなどの質問タイプには別途対応が必要です。
          * 例: 特定の質問タイトルに回答する場合
            ```javascript
            // 「お名前」というテキスト質問に回答
            const nameItem = form.getItemsByName("お名前")[0].asTextItem();
            response.withItemResponse(nameItem.createResponse("GASテストユーザー"));
            ```
      * この設定が正確でないと、正しく回答が送信されません。

### 4\. スクリプトの実行と承認

スクリプトがGoogleサービスにアクセスすることを許可します。

1.  スクリプトエディタの上部にある関数選択ドロップダウンから「`setupTrigger`」を選択します。
2.  その右隣にある「**実行**」ボタン（▶アイコン）をクリックします。
3.  初回実行時には、Googleアカウントへのアクセス許可を求められます。「**権限を確認**」をクリックし、指示に従って必要な権限（Googleドライブ、Googleフォーム、スプレッドシートなどへのアクセス）を許可してください。

### 5\. 自動実行の開始

`setupTrigger` 関数が正常に実行されると、自動的にプログラムが動作を開始します。

1.  スクリプトエディタの左側メニューにある「**トリガー**」（時計のアイコン）をクリックします。
2.  「`sendFormResponses`」という名前のトリガーが、「**時間主導型**」「**分タイマー**」「**1分ごと**」といった設定で追加されていることを確認してください。

これで、設定したGoogleフォームに、1分ごとに指定した回数の回答が自動で送信されるようになります。

-----

## 🛑 プログラムの停止方法

自動送信を停止したい場合は、設定したトリガーを削除します。

1.  スクリプトエディタの左側メニューにある「**トリガー**」（時計のアイコン）をクリックします。
2.  一覧表示されている `sendFormResponses` のトリガーの右にある縦3点リーダーをクリックし、「**トリガーを削除**」を選択します。
3.  または、スクリプトエディタの関数選択ドロップダウンから「`deleteTrigger`」を選択し、「実行」ボタンをクリックすることでも削除できます。

-----

## ⚠️ 注意事項

  * **APIの制限**: 短時間に極端に大量の回答を送信すると、Google Forms APIの制限により一時的にブロックされる可能性があります。
  * **テスト環境での確認**: 本番運用する前に、必ずテスト用のGoogleフォームで動作確認を行うことを強く推奨します。

-----
