import requests
import json

# TeamsのWebhook URL
webhook_url = 'https://prod-30.japaneast.logic.azure.com/workflows/724376f5d28b41cf88315a1e877676d4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hmaHUkMfgG1I7EA5j2Ti9G1ZfJxhQUBR8LPAbHJeAjw'

# 送信するメッセージ
message = {
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.2",
        "body": [
          {
            "type": "TextBlock",
            "text": "## Workflow経由のTeamsへの通知テストです。\n\n* 通知の詳細1です。\n* 通知の詳細2です。",
            "wrap": True,
            "markdown": True
          }
        ]
      }
    }
  ]
}
# POSTリクエストを送信
response = requests.post(
    url=webhook_url,
    data=json.dumps(message),
    headers={'Content-Type': 'application/json'}
)

# レスポンスを確認
if response.status_code == 200 or response.status_code == 202:
    print("メッセージが送信されました")
else:
    print(f"エラーが発生しました: {response.status_code}, {response.text}")