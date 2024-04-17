/** console.log() で出力する文字に色をつける制御文字 */
class ConsoleColor {
  /** 赤色 */
  static readonly RED = '\u001b[31m';

  /** 緑色 */
  static readonly GREEN = '\u001b[32m';

  /** リセット */
  static readonly RESET = '\u001b[0m';
}


/**
 * 異常系のコンソール出力をします。
 * @param message エラーメッセージ
 */
export function ErrorConsoleLog(message: string): void {
  console.error(ConsoleColor.RED + message + ConsoleColor.RESET);
}

/**
 * 異常系のコンソール出力をします。
 * @param error エラー
 */
export function ErrorConsoleLogTrace(error: Error): void {
  console.error(ConsoleColor.RED + error.message + ConsoleColor.RESET);
  console.error(error);
}
/**
 * 正常系のコンソール出力をします。
 * @param message メッセージ
 */
export function SuccessConsoleLog(message: string): void {
  console.info(ConsoleColor.GREEN + message + ConsoleColor.RESET);
}
