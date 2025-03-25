// AWSマネジメントコンソールのリージョンを取得する関数
function getCurrentRegion() {
    try {
      // 提供されたHTMLに基づいて、より具体的なセレクタを使用
      const regionButton = document.querySelector('[data-testid="more-menu__awsc-nav-regions-menu-button"]');
      
      if (!regionButton) {
        console.log("AWS Region Warning: リージョンボタンが見つかりませんでした。");
        return null;
      }
      
      // タイトル属性を持つspan要素を取得
      const regionElement = regionButton.querySelector('span[title]');
      
      if (!regionElement) {
        console.log("AWS Region Warning: リージョン要素が見つかりませんでした。");
        return null;
      }
  
      const regionName = regionElement.textContent.trim();
      console.log("AWS Region Warning: 現在のリージョン名は", regionName);
  
      // 「グローバル」の場合は除外
      if (regionName === "グローバル") {
        return null;
      }
  
      return regionName;
    } catch (error) {
      console.error("リージョン取得エラー:", error);
      return null;
    }
  }
  
  // 警告を一度だけ表示するためのフラグ
  let warningShown = false;
  
  // 現在のリージョンをチェックして警告を表示
  function checkRegion(preferredRegion) {
    try {
      const currentRegion = getCurrentRegion();
      
      if (!currentRegion) {
        return; // リージョンが取得できない場合はスキップ
      }
  
      if (currentRegion !== preferredRegion && !warningShown) {
        // アラート文に改行を追加
        alert(`警告:\n\n現在のリージョンは "${currentRegion}" です。\n推奨リージョンは "${preferredRegion}" です。`);
        warningShown = true; // 警告を表示したことを記録
      }
    } catch (error) {
      console.error("リージョンチェックエラー:", error);
    }
  }
  
  // ユーザー設定を取得してリージョンをチェック
  function loadPreferredRegionAndCheck() {
    try {
      // Firefoxでは、chrome APIの代わりにbrowser APIを使用
      const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
      
      storageAPI.sync.get(["preferredRegion", "enableCheck"]).then(data => {
        if (data.enableCheck === false) {
          return; // 判定が無効化されている場合はスキップ
        }
  
        const preferredRegion = data.preferredRegion;
        if (!preferredRegion) {
          return;
        }
        
        checkRegion(preferredRegion);
      }).catch(error => {
        // エラー処理
        if (!error.message || !error.message.includes("Extension context invalidated")) {
          console.error("設定読み込みエラー:", error);
        }
      });
    } catch (error) {
      // Promiseベースでない場合のフォールバック
      try {
        chrome.storage.sync.get(["preferredRegion", "enableCheck"], (data) => {
          if (chrome.runtime.lastError) {
            return;
          }
          
          if (data.enableCheck === false) {
            return;
          }
  
          const preferredRegion = data.preferredRegion;
          if (!preferredRegion) {
            return;
          }
          
          checkRegion(preferredRegion);
        });
      } catch (fallbackError) {
        if (!fallbackError.message || !fallbackError.message.includes("Extension context invalidated")) {
          console.error("設定読み込みエラー (フォールバック):", fallbackError);
        }
      }
    }
  }
  
  // URL変更の追跡用
  let lastCheckedUrl = document.location.href;
  
  // DOMの変更を監視してリージョンをチェック
  function setupObserver() {
    try {
      const observer = new MutationObserver(() => {
        try {
          // URL変更を検出して警告状態をリセット
          if (document.location.href !== lastCheckedUrl) {
            warningShown = false;
            lastCheckedUrl = document.location.href;
          }
          loadPreferredRegionAndCheck();
        } catch (error) {
          // エラーが発生した場合はログを出力
          console.error("Mutation Observer内でエラーが発生しました:", error);
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
      console.log("AWS Region Warning: DOMの変更を監視しています。");
    } catch (error) {
      console.error("Observer設定エラー:", error);
    }
  }
  
  // ページ遷移時に警告状態をリセット
  function setupNavigationListener() {
    try {
      const resetHandler = () => {
        warningShown = false;
      };
      
      window.addEventListener('popstate', resetHandler);
    } catch (error) {
      console.error("ナビゲーションリスナーエラー:", error);
    }
  }
  
  // ページの読み込み後に初期化
  window.addEventListener("load", () => {
    try {
      console.log("AWS Region Warning: 拡張機能を初期化しています...");
      
      // 初回チェック
      setTimeout(() => {
        try {
          loadPreferredRegionAndCheck();
        } catch (error) {
          console.error("初回チェックエラー:", error);
        }
      }, 2000);
      
      // ナビゲーションリスナー設定
      setupNavigationListener();
      
      // 監視を開始
      setupObserver();
    } catch (error) {
      console.error("初期化エラー:", error);
    }
  });