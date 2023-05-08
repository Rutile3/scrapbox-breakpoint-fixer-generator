import css from "css";
import * as fs from "fs/promises";
import prettier from "prettier";
import { ErrorConsoleLog, SuccessConsoleLog } from "./consoleLog";
import { downloadAppCssText } from "./downloadAppCss";
import { ImportJson, ImportJsonPage } from "./importJsonIntoScrapbox";

/** 定数 */
const scrapboxPageTitle = "app-breakpoint-fixer";
const cssFileName = `${scrapboxPageTitle}.css`;
const jsonFileName = `${scrapboxPageTitle}.json`;

async function main() {
  try {
    // app.css をテキストで取得し、フォーマット
    // ※フォーマットしないと url("") の記述をパースできないので、フォーマットしている
    const appCss = await downloadAppCssText();
    const formattedAppCss = prettier.format(appCss, { parser: "css" });

    // app.css パースし、メディアクエリのみ取得
    const appCssRootNode = css.parse(formattedAppCss);
    const mediaRules = extractMediaRules(appCssRootNode);

    // メディアクエリのブレイクポイントを置換
    const fixedMediaRules = replaceMediaRulesBreakpoint(mediaRules);

    // ブレイクポイントを修正した CSS をテキストで取得
    const fixedCss = stringifyMediaRules(fixedMediaRules);

    // Scrapbox でインポートする JSON を作成
    const importJson = new ImportJson();
    const importPage = new ImportJsonPage(scrapboxPageTitle);
    const codeBlock = ImportJsonPage.makeCodeBlockLines(cssFileName, fixedCss);
    importPage.lines.push(...codeBlock);
    importPage.lines.push("");
    importPage.lines.push("#Scrapbox #UserCSS");
    importPage.lines.push("");
    importJson.pages.push(importPage);

    // JSON ファイルを作成
    await fs.writeFile(jsonFileName, importJson.stringify());
    SuccessConsoleLog(`${jsonFileName} created and text written successfully.`);
  } catch (error) {
    ErrorConsoleLog("catch error");

    if (error instanceof Error) {
      ErrorConsoleLog(error.message);
    } else if (typeof error === "string") {
      ErrorConsoleLog(error);
    } else {
      ErrorConsoleLog("unexpected error");
    }
  }
}

/**
 * CSS の root node からメディアクエリのみ抽出します。
 * @param rootNode AST object
 * @returns メディアクエリの配列
 */
function extractMediaRules(rootNode: css.Stylesheet): css.Media[] {
  let mediaRules: css.Media[] = [];

  rootNode.stylesheet?.rules.forEach((rule) => {
    if (rule.type === "media") {
      mediaRules.push({ ...rule } as css.Media);
    }
  });

  return mediaRules;
}

/**
 * メディアクエリのブレイクポイントを置換します。
 * @param mediaRules メディアクエリの配列
 * @returns ブレイクポイントを置換したメディアクエリの配列
 */
function replaceMediaRulesBreakpoint(mediaRules: css.Media[]) {
  const fixMediaRules = [...mediaRules];

  for (const fixMediaRule of fixMediaRules) {
    if (fixMediaRule.media !== undefined) {
      fixMediaRule.media = fixMediaRule.media
        .replace(/\(max-width:\s*767px\)/, "(width < 768px)")
        .replace(/\(max-width:\s*991px\)/, "(width < 992px)")
        .replace(/\(max-width:\s*1199px\)/, "(width < 1200px)")
        .replace(/\(min-width:\s*768px\)/, "(768px <= width)")
        .replace(/\(min-width:\s*992px\)/, "(992px <= width)")
        .replace(/\(min-width:\s*1092px\)/, "(1092px <= width)")
        .replace(/\(min-width:\s*1200px\)/, "(1200px <= width)");
    }
  }

  return fixMediaRules;
}

/**
 * メディアクエリの配列を JSON 文字列 に変換します。
 * @param mediaRules メディアクエリの配列
 * @returns JSON 文字列
 */
function stringifyMediaRules(mediaRules: css.Media[]): string {
  const cssRootNode = css.parse("");
  if (cssRootNode.stylesheet === undefined) {
    throw new Error("cssRootNode.stylesheet is undefined");
  }

  cssRootNode.stylesheet.rules = mediaRules;
  return css.stringify(cssRootNode);
}

main();
