// シートデータを取得する共通関数
async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${CONFIG.API_KEY}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();

    // エラーチェック
    if (data.error) {
      console.error("APIエラー:", data.error.message);
      return [];
    }

    const values = data.values;
    if (!values || values.length < 2) return [];

    const keys = values[0];

    // 1行目をヘッダーとしてオブジェクト配列に変換
    return values.slice(1).map(row => {
      const obj = {};
      keys.forEach((key, i) => obj[key] = row[i] || "");
      return obj;
    });

  } catch (err) {
    console.error("取得失敗:", err);
    return [];
  }
}
