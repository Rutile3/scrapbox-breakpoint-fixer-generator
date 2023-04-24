import * as fs from "fs/promises";
import { downloadTextData } from "./download";

const appCssUrl = "https://scrapbox.io/assets/css/app.css";
const fixerCssFileName = "app-breakpoint-fixer.css";

async function main() {
  try {
    const appCssText = await downloadTextData(appCssUrl);
    
    // TODO: app.cssからメディアクエリを抽出
    // @media((and )*\((max|min)-width: \d{3,4}px\))* \{\n(.*\n)+?\}\n\n

    // TODO: メディアクエリのmaxを置換
    // max-width
    // (max-width: 767px) -> (width < 768px)
    // (max-width: 991px) -> (width < 992px)
    // (max-width: 1199px) -> (width < 1200px)
    const fixerCssText = appCssText;

    // fixerCssFile を作成
    await fs.writeFile(fixerCssFileName, fixerCssText);
    console.log(`${fixerCssFileName} created and text written successfully.`);
  } catch (error) {
    console.log("catch error");

    if (error instanceof Error) {
      console.log(error.message);
    } else if (typeof error === "string") {
      console.log(error);
    } else {
      console.log("unexpected error");
    }
  }
}

main();
