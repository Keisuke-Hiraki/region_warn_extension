// AWSマネジメントコンソールのリージョンを取得する関数
function getCurrentRegion() {
  // リージョン名が含まれる要素を取得
  const regionElement = document.querySelector('[data-testid="awsc-nav-regions-menu-button"] span._more-menu__button-content--label_15sl6_258');
  
  // デバッグ用ログ
  // if (regionElement == null) {
  //   console.log(regionElement)
  //   console.warn("AWS Region Warning: リージョン要素が見つかりませんでした。");
  //   return null;
  // }

  const regionName = regionElement.textContent.trim();
  console.log("AWS Region Warning: 現在のリージョン名は", regionName);

  // 「グローバル」の場合は除外
  if (regionName === "グローバル") {
    console.log("AWS Region Warning: 現在のリージョンはグローバルのため、警告をスキップします。");
    return null;
  }

  return regionName;
}

// 警告を一度だけ表示するためのフラグ
let warningShown = false;

// 現在のリージョンをチェックして警告を表示
function checkRegion(preferredRegion) {
  const currentRegion = getCurrentRegion();
  if (!currentRegion) {
    // リージョンが取得できない場合（例: グローバル）はスキップ
    return;
  }

  if (currentRegion !== preferredRegion && !warningShown) {
    alert(`警告: 現在のリージョンは "${currentRegion}" です。推奨リージョンは "${preferredRegion}" です。`);
    warningShown = true; // 警告を表示したことを記録
  }
}

// ユーザー設定を取得してリージョンをチェック
function loadPreferredRegionAndCheck() {
  chrome.storage.sync.get(["preferredRegion", "enableCheck"], (data) => {
    if (!data.enableCheck) {
      console.log("AWS Region Warning: リージョン判定は無効化されています。");
      return; // 判定が無効化されている場合はスキップ
    }

    const preferredRegion = data.preferredRegion; // ユーザーが設定したリージョンを取得
    if (!preferredRegion) {
      console.warn("AWS Region Warning: 推奨リージョンが設定されていません。");
      return;
    }
    console.log("AWS Region Warning: 推奨リージョンは", preferredRegion);
    checkRegion(preferredRegion);
  });
}

// DOMの変更を監視してリージョンをチェック
const observer = new MutationObserver(() => {
  try {
    loadPreferredRegionAndCheck();
  } catch (error) {
    console.error("AWS Region Warning: エラーが発生しました:", error);
  }
});

// ページの読み込み後に監視を開始
window.addEventListener("load", () => {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  observer.observe(targetNode, config);
  console.log("AWS Region Warning: DOMの変更を監視しています。");
});