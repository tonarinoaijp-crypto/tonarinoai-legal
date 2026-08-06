# 習慣手帳 LP リリース切替手順書

審査承認当日に、LPを「事前登録（Formspree）」から「ストア誘導」へ切り替える手順です。

**編集するファイルは `config.js` の1つだけです。** `index.html` は触りません
（バンドル済みファイルのため手編集しないでください）。

---

## 事前準備：PostHogキーの差し込み

**当日ではなく、事前に済ませておくことを推奨します。**

PostHog の `Settings → Project → Project API Key` から `phc_` で始まる公開キーを取得し、
`config.js` の **21行目** に差し込みます。

```js
POSTHOG_KEY: "POSTHOG_KEY_PLACEHOLDER",
↓
POSTHOG_KEY: "phc_xxxxxxxxxxxxxxxxxxxxxxxx",
```

- このキーは公開キーのため、リポジトリに含めて問題ありません
- `phc_` で始まらない限り計測は自動的に無効化され、**LPの表示・動作には影響しません**
- 差し込み後、ブラウザのコンソールに `[lp] PostHog キーが未設定` が出なくなれば有効です

---

## 当日の手順

### ステップ1：`config.js` の14行目を `true` に

```js
RELEASE_MODE: false,
↓
RELEASE_MODE: true,
```

### ステップ2：`config.js` の17行目にストアURLを貼る

```js
STORE_URL: "",
↓
STORE_URL: "https://play.google.com/store/apps/details?id=＜実際のパッケージ名＞",
```

> **注意：** `RELEASE_MODE` を `true` にしても `STORE_URL` が空のままだと、
> リンク切れを防ぐため**事前登録フォームの表示が維持されます**。
> 必ず2箇所セットで変更してください（コンソールに警告が出ます）。

### ステップ3：目視確認（push前）

ローカルで `widget-habit-tracker/lp/index.html` をブラウザで開き、以下を確認します。

| # | 確認項目 | 期待する結果 |
|---|---|---|
| 1 | ページ上部のヒーローCTA | ラベルが **「無料でダウンロード」** になっている |
| 2 | ヒーローCTAをクリック | **別タブでGoogle Playが開く**（`#waitlist` へのスクロールではない） |
| 3 | ページ下部のセクション | 見出しが **「Google Playで公開中」** になっている |
| 4 | 同セクションの本文 | 「事前登録いただいた皆さま、ありがとうございました。公開しました！」 |
| 5 | 「無料でダウンロード」ボタン | 別タブでGoogle Playが開く |
| 6 | メールアドレス入力欄 | **表示されていない**（事前登録フォームが消えている） |
| 7 | DevTools → Console | 赤いエラーが出ていない |
| 8 | DevTools → Application → Cookies | **空**（cookieを使わない設定のため） |

PostHogキー差し込み済みの場合は、DevTools → Network で `us.i.posthog.com` 宛に
`lp_view`、CTAクリック時に `lp_cta_click` が送信されていることも確認できます。

### ステップ4：commit & push

```bash
cd C:/dev/tonarinoai-legal
git add widget-habit-tracker/lp/config.js
git status
git commit -m "Switch habit tracker LP to store mode"
git push
```

`git status` で **`config.js` 以外が含まれていないこと**を確認してからcommitしてください。

### ステップ5：本番確認

GitHub Pages の反映（通常1〜2分）を待ってから、本番URLで**ステップ3と同じ8項目**を再確認します。

https://tonarinoaijp-crypto.github.io/tonarinoai-legal/widget-habit-tracker/lp/

---

## 切り戻し（問題が起きた場合）

`config.js` の14行目を `false` に戻して push すれば、事前登録フォームの表示に戻ります。

```bash
git revert HEAD
git push
```

---

## 計測イベント一覧

| イベント名 | 発火条件 |
|---|---|
| `lp_view` | ページ表示時（常時） |
| `lp_cta_click` | ストアボタンのクリック（`RELEASE_MODE=true` 時のみ） |
| `lp_waitlist_submit` | 事前登録フォームの送信成功時（`RELEASE_MODE=false` 時のみ） |

全イベントに以下のプロパティが自動付与されます。

- `release_mode` … 切替フラグの状態（true / false）
- `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` / `utm_term` … URLに付いていた場合のみ
- `cta_location` … `lp_cta_click` のみ。`hero`（ページ上部）または `bottom`（ページ下部）

広告テスト（LP経由 vs ストア直リンク）では、広告のリンク先URLに
`?utm_source=google&utm_medium=cpc&utm_campaign=＜キャンペーン名＞` を付けてください。

### 計測に関する既知の制約

cookieを使わない設定（`persistence: "memory"`）のため、**ページを読み込むたびに別の匿名利用者として
カウントされます。** ユニークユーザー数は実際より多く出るため、広告テストの比較は
**イベント数とUTM別の内訳**で行ってください。

---

## 関連

- プライバシーポリシー追記（アクセス解析の記載）は**別タスクとして未実施**です。
  LP公開前に対応が必要かご確認ください。
