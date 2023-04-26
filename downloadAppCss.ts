import https from "https";

/** Scrapbox 公式の app.css */
const appCssUrl = "https://scrapbox.io/assets/css/app.css";

/**
 * Scrapbox 公式から app.css のテキストを取得します。
 * @returns app.css のテキスト
 */
export async function downloadAppCssText(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    https
      .get(appCssUrl, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", (err) => reject(err));
  });
}
