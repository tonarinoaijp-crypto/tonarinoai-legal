/* ============================================================
   習慣手帳 LP  リリース切替設定
   ------------------------------------------------------------
   ストア公開当日は、この下の 2 行だけを書き換えてください。

   1) RELEASE_MODE : false -> true
   2) STORE_URL    : Google Play の実URLを "" の中に貼る

   ※ RELEASE_MODE を true にしても STORE_URL が空のままだと、
      リンク切れ防止のため事前登録フォームの表示が維持されます。
   ============================================================ */
window.LP_CONFIG = {
  // 公開前は false（事前登録フォームを表示）/ 公開当日に true（ストア誘導に切替）
  RELEASE_MODE: false,

  // 例: "https://play.google.com/store/apps/details?id=xxx.yyy.zzz"
  STORE_URL: "",

  // PostHog の公開プロジェクトAPIキー（phc_ で始まる文字列に差し替える）
  // 未設定のままでも LP は正常に動作します（計測のみ無効）
  POSTHOG_KEY: "POSTHOG_KEY_PLACEHOLDER",
};
