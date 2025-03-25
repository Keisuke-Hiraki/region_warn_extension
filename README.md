# AWS Region Warning

AWS マネジメントコンソールで作業する際に、設定した推奨リージョン以外で作業している場合に警告を表示するブラウザ拡張機能です。Chrome と Firefox の両方に対応しています。

## 機能

- AWSコンソール上で現在選択されているリージョンを監視
- 設定した推奨リージョン以外で作業している場合に警告アラートを表示
- ユーザーが推奨リージョンを設定できるオプションページ
- リージョンチェック機能のオン/オフを切り替え可能

## 制約

- AWSマネジメントコンソールの言語表記を日本語設定をしている場合のみ動作します

## インストール方法
### Chrome

1. このリポジトリをクローンまたはダウンロードします
   ```
   git clone https://github.com/Keisuke-Hiraki/region_warn_extension.git
   ```
2. Chrome で `chrome://extensions/` を開きます
3. 右上の「デベロッパーモード」をオンにします
4. 「パッケージ化されていない拡張機能を読み込む」をクリックします
5. ダウンロードしたリポジトリの `chrome` フォルダを選択します

### Firefox

1. このリポジトリをクローンまたはダウンロードします
   ```
   git clone https://github.com/Keisuke-Hiraki/region_warn_extension.git
   ```
2. ダウンロードしたリポジトリの `firefox` フォルダ配下のファイルを全て選択しzip化します。
3. Firefox で `about:debugging#/runtime/this-firefox` を開きます
4. 「一時的なアドオンを読み込む」をクリックします
5. 先ほど圧縮したzipファイルを選択します

## 使い方

1. 拡張機能をインストール後、拡張機能アイコンを右クリックして「オプション」を選択します
2. 推奨リージョンを選択し、「Enable Region Check」にチェックを入れます
3. 「Save」ボタンをクリックして設定を保存します
4. AWSマネジメントコンソールを開くと、設定したリージョン以外で作業している場合に警告が表示されます

## リポジトリの構成

```
aws-region-warning/
├── chrome/                 # Chrome用拡張機能
│   ├── manifest.json       # Chrome用マニフェスト
│   ├── content.js          # コンテンツスクリプト
│   ├── options.html        # 設定ページ
│   └── options.js          # 設定ページのスクリプト
├── firefox/                # Firefox用拡張機能
│   ├── manifest.json       # Firefox用マニフェスト
│   ├── content.js          # コンテンツスクリプト
│   ├── options.html        # 設定ページ
│   └── options.js          # 設定ページのスクリプト
└── README.md               # このファイル
```

**免責事項**: この拡張機能は AWS の公式製品ではありません。AWS のサービスやインターフェースが変更された場合、機能が正常に動作しなくなる可能性があります。