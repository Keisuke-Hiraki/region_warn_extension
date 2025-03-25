// Firefoxでは、chrome APIの代わりにbrowser APIを使用
const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

// 保存ボタンがクリックされたときの処理
document.getElementById("save").addEventListener("click", () => {
  const region = document.getElementById("region").value; // 選択されたリージョンを取得
  const enableCheck = document.getElementById("enableCheck").checked; // チェックボックスの状態を取得

  // Promiseベースの保存（Firefox用）
  if (typeof browser !== 'undefined') {
    browser.storage.sync.set({ 
      preferredRegion: region, 
      enableCheck: enableCheck 
    }).then(() => {
      showSavedMessage();
    }).catch(error => {
      console.error("設定の保存中にエラーが発生しました:", error);
    });
  } 
  // コールバックベースの保存（Chrome用）
  else {
    chrome.storage.sync.set({ 
      preferredRegion: region, 
      enableCheck: enableCheck 
    }, () => {
      showSavedMessage();
    });
  }
});

// 保存成功メッセージを表示
function showSavedMessage() {
  const status = document.getElementById("status");
  status.style.display = "block";
  setTimeout(() => {
    status.style.display = "none";
  }, 2000);
  console.log("AWS Region Warning: 設定が保存されました");
}

// ページを開いたときに現在の設定を表示
document.addEventListener("DOMContentLoaded", () => {
  // Promiseベースの読み込み（Firefox用）
  if (typeof browser !== 'undefined') {
    browser.storage.sync.get(["preferredRegion", "enableCheck"]).then(data => {
      if (data.preferredRegion) {
        document.getElementById("region").value = data.preferredRegion;
      }
      if (data.enableCheck !== undefined) {
        document.getElementById("enableCheck").checked = data.enableCheck;
      } else {
        // デフォルトでチェックを有効にする
        document.getElementById("enableCheck").checked = true;
      }
    }).catch(error => {
      console.error("設定の読み込み中にエラーが発生しました:", error);
    });
  } 
  // コールバックベースの読み込み（Chrome用）
  else {
    chrome.storage.sync.get(["preferredRegion", "enableCheck"], (data) => {
      if (data.preferredRegion) {
        document.getElementById("region").value = data.preferredRegion;
      }
      if (data.enableCheck !== undefined) {
        document.getElementById("enableCheck").checked = data.enableCheck;
      } else {
        // デフォルトでチェックを有効にする
        document.getElementById("enableCheck").checked = true;
      }
    });
  }
});