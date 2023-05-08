import css, { Media } from "css";
import * as fs from "fs/promises";
import prettier from "prettier";
import { ErrorConsoleLog, SuccessConsoleLog } from "./consoleLog";
import { downloadAppCssText } from "./downloadAppCss";

/**  */
const fixerCssName = "app-breakpoint-fixer";

class ImportJsonPage {
  /** ページタイトル */
  title: string;

  /** ページタイトルを含む本文 */
  lines: string[];

  constructor(title: string) {
    this.title = title;
    this.lines = [title];
  }
}

class ImportJson {
  pages: ImportJsonPage[] = [];
}

async function main() {
  try {
    // app.css をテキストで取得し、フォーマット
    // ※フォーマットしないと url("") の記述をパースできないので、フォーマットしている
    const appCssText = await downloadAppCssText();
    const formattedAppCssText = prettier.format(appCssText, { parser: "css" });

    // app.cssのメディアクエリのみ取得
    const appCssRootNode = css.parse(formattedAppCssText);
    const mediaRules = extractMediaRules(appCssRootNode);

    // メディアクエリのブレイクポイントを置換
    const fixedMediaRules = replaceMediaRulesBreakpoint(mediaRules);

    // ブレイクポイントを修正した CSS をテキストで取得
    const fixedAppCssRootNode = css.parse("");
    if (fixedAppCssRootNode.stylesheet === undefined) {
      throw new Error("fixedAppCssRootNode.stylesheet undefined");
    }
    fixedAppCssRootNode.stylesheet.rules = fixedMediaRules;
    const fixedCssText = css.stringify(fixedAppCssRootNode);

    // JSON形式
    const importJson = new ImportJson();
    const importPage = new ImportJsonPage(fixerCssName);
    importPage.lines.push(`code:${fixerCssName}.css`);
    fixedCssText.split("\n").forEach((v) => importPage.lines.push(" " + v));
    importJson.pages.push(importPage);

    // fixerCssFileName を作成
    await fs.writeFile(`${fixerCssName}.json`, JSON.stringify(importJson));
    SuccessConsoleLog(`${fixerCssName} created and text written successfully.`);
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
function extractMediaRules(rootNode: css.Stylesheet): Media[] {
  let mediaRules: Media[] = [];

  rootNode.stylesheet?.rules.forEach((rule) => {
    if (rule.type === "media") {
      mediaRules.push({ ...rule } as Media);
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

main();
