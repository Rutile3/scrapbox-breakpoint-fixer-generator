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
  console.log(ConsoleColor.RED + message + ConsoleColor.RESET);
}

/**
 * 正常系のコンソール出力をします。
 * @param message メッセージ
 */
export function SuccessConsoleLog(message: string): void {
  console.log(ConsoleColor.GREEN + message + ConsoleColor.RESET);
}
