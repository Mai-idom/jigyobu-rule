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

function convertLinks(text) {
  if (!text) return "";

  const pageMap = {
    "LINE":       "LINE.html",
    "日次":       "daily.html",
    "週次":       "weekly.html",
    "月次":       "monthly.html",
    "その他":     "other.html",
    "カレンダー": "calendar.html",
    "メール":     "mail.html",
    "メンバーズ": "members.html",
    "全社ルール": "company-rules.html",
  };

  text = text.replace(
    /([^\s「」]+)「([^」]+)」参照/g,
    (match, pageName, catName) => {
      const url = pageMap[pageName];
      if (!url) return match;
      const link = `${url}#${encodeURIComponent(catName)}`;
      return `<a href="${link}" target="_blank" style="color:#1F4E79;font-weight:bold;text-decoration:underline;">${match}</a>`;
    }
  );

  text = text.replace(
    /([^\s「」]+)全体参照/g,
    (match, pageName) => {
      const url = pageMap[pageName];
      if (!url) return match;
      return `<a href="${url}" target="_blank" style="color:#1F4E79;font-weight:bold;text-decoration:underline;">${match}</a>`;
    }
  );

  return text.replace(/\n/g, "<br>");
}

function highlightText(text, keyword) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark style="background:#FFF176;padding:0 2px;">$1</mark>');
}