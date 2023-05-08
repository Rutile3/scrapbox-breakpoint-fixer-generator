class ConsoleColor {
  static readonly RED = "\u001b[31m";
  static readonly GREEN = "\u001b[32m";
  static readonly RESET = "\u001b[0m";
}

export function ErrorConsoleLog(message: string): void {
  console.log(ConsoleColor.RED + message + ConsoleColor.RESET);
}

export function SuccessConsoleLog(message: string): void {
  console.log(ConsoleColor.GREEN + message + ConsoleColor.RESET);
}
