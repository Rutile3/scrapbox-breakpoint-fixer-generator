import https from "https";

// URLからテキストデータを取得します。
export async function downloadTextData(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
