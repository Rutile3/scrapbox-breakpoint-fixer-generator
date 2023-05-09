
# コーディング規約

## 概要

TypeScript のコードに一貫性を持たせるためにザックリとした基準を記述します。

---

## 変数と関数

変数と関数名には`camelCase`を使います。
> 理由：従来の JavaScript。

悪い例

```ts
var FooVar;
function BarFunc() {}
```

良い例

```ts
var fooVar;
function barFunc() {}
```

---

## クラス

クラス名には`PascalCase`を使います。

> 理由：JavaScript では一般的なため。

悪い例

```ts
class foo {}
```

良い例

```ts
class Foo {}
```

メンバとメソッドには`camelCase`を使います。

> 理由：当然のことながら、変数と関数の命名規則に従う。

悪い例

```ts
class Foo {
  Bar: number;
  Baz() {}
}
```

良い例

```ts
class Foo {
  bar: number;
  baz() {}
}
```

---

## インターフェース

インターフェース名には`PascalCase`を使います。

> 理由：クラスと記法を統一するため。

メンバとメソッドには`camelCase`を使います。

> 理由：クラスと記法を統一するため。

接頭辞には`I`をつけない。

> 理由：慣例的ではないため。

---

## 型（Type）

型の名前には`PascalCase`を使います。

> 理由：クラスと記法を統一するため。

メンバには`camelCase`を使います。

> 理由：クラスと記法を統一するため。

---

## 名前空間（Namespace）

名前空間の名前には`PascalCase`を使います。

理由：名前空間は事実上静的メンバを持つクラスなので、クラスと記法を統一するため。

悪い例

```ts
namespace foo {
}
```

良い例

```ts
namespace Foo {
}
```

---

## 引用符

エスケープしない場合は、シングルクォート(`'`)を使います。

> 理由：JavaScript では一般的なため。  
> 例：[Standard JS](https://github.com/standard/standard)
> , [npm](https://github.com/npm/npm)
> , [Node.js](https://github.com/nodejs/node)

エスケープする場合は、バッククォート(`` ` ``)を使います。

---

## インデント

インデントはスペース2つを使います。

---

## セミコロン

明示的にセミコロンを使います。

---

## 配列

配列は`foos: Array<Foo>`ではなく`foos: Foo[]`を使います。

> 理由：他言語でも配列を`[]`で表すのは一般的で、`Array<>`より短く可読性が高いため。

---

## フォルダとファイル

フォルダとファイル名は`camelCase`を使います。

> 理由：多くのJSチームで慣習的なため。

---
