// 保存ボタンがクリックされたときの処理
document.getElementById("save").addEventListener("click", () => {
  const region = document.getElementById("region").value; // 選択されたリージョンを取得
  const enableCheck = document.getElementById("enableCheck").checked; // チェックボックスの状態を取得

  chrome.storage.sync.set({ preferredRegion: region, enableCheck: enableCheck }, () => {
    const status = document.getElementById("status");
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
    console.log("AWS Region Warning: 設定が保存されました:", { region, enableCheck });
  });
});

// ページを開いたときに現在の設定を表示
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["preferredRegion", "enableCheck"], (data) => {
    if (data.preferredRegion) {
      document.getElementById("region").value = data.preferredRegion; // 保存されたリージョンを選択状態にする
    }
    if (data.enableCheck !== undefined) {
      document.getElementById("enableCheck").checked = data.enableCheck; // チェックボックスの状態を反映
    }
    console.log("AWS Region Warning: 現在の設定は", data);
  });
});