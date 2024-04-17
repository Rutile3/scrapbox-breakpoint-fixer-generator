import { CssMediaAST, CssStylesheetAST, parse, stringify } from '@adobe/css-tools'
import * as fs from 'fs/promises';
import prettier from 'prettier';

import { ErrorConsoleLog, ErrorConsoleLogTrace, SuccessConsoleLog } from './consoleLog';
import { downloadAppCssText } from './downloadAppCss';
import { ImportJson, ImportJsonPage } from './importJsonIntoScrapbox';

/** 定数 */
const scrapboxPageTitle = 'scrapbox-breakpoint-fixer';
const cssFileName = 'style.css';
const jsonFileName = 'import-pages.json';

async function main() {
  try {
    // app.css をテキストで取得し、フォーマット
    // ※フォーマットしないと url("") の記述をパースできないので、フォーマットしている
    const appCss = await downloadAppCssText();
    const formattedAppCss = prettier.format(appCss, { parser: 'css' });

    // app.css パースし、メディアクエリのみ取得
    const appCssRootNode = parse(formattedAppCss);
    const mediaRules = extractMediaRules(appCssRootNode);

    // メディアクエリのブレイクポイントを置換
    const fixedMediaRules = replaceMediaRulesBreakpoint(mediaRules);

    // ブレイクポイントを修正した CSS をテキストで取得
    const fixedCss = stringifyMediaRules(fixedMediaRules);

    // Scrapbox でインポートする JSON を作成
    // ※CSS が長すぎてページにペーストができないので、『Import Pages』から読み込むために JSON を作成している
    const importJson = new ImportJson();
    const importPage = new ImportJsonPage(scrapboxPageTitle);
    const codeBlock = ImportJsonPage.makeCodeBlockLines(cssFileName, fixedCss);
    importPage.lines.push('解説記事：[【Scrapbox】ウィンドウサイズの横幅が767pxの時に、見た目が崩れるのを防ぐ【UserCSS】]');
    importPage.lines.push('');
    importPage.lines.push('Created date:' + new Date().toLocaleDateString());
    importPage.lines.push(...codeBlock);
    importPage.lines.push(...['', '#Scrapbox #UserCSS #CSS', '']);
    importJson.pages.push(importPage);

    // JSON ファイルを作成
    await fs.writeFile(jsonFileName, importJson.stringify());
    SuccessConsoleLog(`${jsonFileName} created and text written successfully.`);
  } catch (error) {
    ErrorConsoleLog('catch error');

    if (error instanceof Error) {
      ErrorConsoleLogTrace(error);
    } else if (typeof error === 'string') {
      ErrorConsoleLog(error);
    } else {
      ErrorConsoleLog('unexpected error');
    }
  }
}

/**
 * CSS の root node からメディアクエリのみ抽出します。
 * @param rootNode AST object
 * @returns メディアクエリの配列
 */
function extractMediaRules(rootNode: CssStylesheetAST): CssMediaAST[] {
  let mediaRules: CssMediaAST[] = [];

  rootNode.stylesheet?.rules.forEach((rule) => {
    if (rule.type === 'media') {
      mediaRules.push({ ...rule } as CssMediaAST);
    }
  });

  return mediaRules;
}

/**
 * メディアクエリのブレイクポイントを置換します。
 * @param mediaRules メディアクエリの配列
 * @returns ブレイクポイントを置換したメディアクエリの配列
 */
function replaceMediaRulesBreakpoint(mediaRules: CssMediaAST[]) {
  const fixMediaRules = [...mediaRules];

  for (const fixMediaRule of fixMediaRules) {
    if (fixMediaRule.media !== undefined) {
      fixMediaRule.media = fixMediaRule.media
        .replace(/\(max-width:\s*767px\)/, '(width < 768px)')
        .replace(/\(max-width:\s*991px\)/, '(width < 992px)')
        .replace(/\(max-width:\s*1199px\)/, '(width < 1200px)')
        .replace(/\(min-width:\s*768px\)/, '(768px <= width)')
        .replace(/\(min-width:\s*992px\)/, '(992px <= width)')
        .replace(/\(min-width:\s*1092px\)/, '(1092px <= width)')
        .replace(/\(min-width:\s*1200px\)/, '(1200px <= width)');
    }
  }

  return fixMediaRules;
}

/**
 * メディアクエリの配列を JSON 文字列 に変換します。
 * @param mediaRules メディアクエリの配列
 * @returns JSON 文字列
 */
function stringifyMediaRules(mediaRules: CssMediaAST[]): string {
  const cssRootNode = parse('');
  if (cssRootNode.stylesheet === undefined) {
    throw new Error('cssRootNode.stylesheet is undefined');
  }

  cssRootNode.stylesheet.rules = mediaRules;
  return stringify(cssRootNode);
}

main();
