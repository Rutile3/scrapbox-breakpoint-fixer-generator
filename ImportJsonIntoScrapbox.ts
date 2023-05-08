/** Scrapbox に取込む Json */
class ImportJson {
  /** 取込むページ（複数） */
  public pages: ImportJsonPage[] = [];

  /**
   * このオブジェクトを Json 文字列に変換します。
   * @returns Json 文字列
   */
  public stringify(): string {
    return JSON.stringify(this);
  }
}

/** Scrapbox に取込むページ */
class ImportJsonPage {
  /** ページタイトル */
  public title: string;

  /** ページタイトルを含む本文 */
  public lines: string[];

  public constructor(title: string) {
    this.title = title;
    this.lines = [title];
  }
}

/**
 * ファイル名とソースコードからコードブロックを作成します。
 * @param fileName ファイル名
 * @param code ソースコード
 * @param indent インデント
 * @returns コードブロックのライン
 */
function makeCodeBlockLines(
  fileName: string,
  code: string,
  indent: number = 0
) {
  const lines: string[] = [];
  const indentSpace = " ".repeat(indent);

  // インデントを考慮してコードブロックを作成
  lines.push(indentSpace + `code:${fileName}`);
  code.split("\n").forEach((line) => {
    lines.push(indentSpace + " " + line);
  });

  return lines;
}
