# turbowarp-plus-site-header

TurboWarp Plus 系パッケージのドキュメントサイトに共通のヘッダを付けるパッケージです。そのページがどの一覧に属するかを示し、インデックス・リポジトリ・もう一方の言語への戻り道を1本のバーにまとめます。

[English](README.md) | [日本語](README.ja.md)

既存の作りの上に重ねる方針です。これらのサイトは約半数が独自ヘッダを持ち、半数は持たないため、誰かのナビゲーションを置き換えるのではなく、ファミリ共通のバーを足します。

## 使い方

`<script>` 1行だけです。配信されるのはバンドル済みの単一ファイルなので、
ブラウザが持つのは「前のビルド全体」か「新しいビルド全体」のどちらかで、
新旧が混ざることはありません。

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@kubohiroya/turbowarp-plus-site-header@0/dist/auto.js"
></script>
```

`<turbowarp-plus-header>` を登録し、ページ先頭に1つ挿入します。位置を自分で決めたい場合や固定したい場合は、要素を書いておけばスクリプトはそれに触れません。

```html
<turbowarp-plus-header sticky></turbowarp-plus-header>
```

### 自動で判定するもの

|                      | 判定元                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| どのパッケージか     | `<owner>.github.io/<repo>/` の先頭パスセグメント                          |
| リポジトリへのリンク | `github.com/<owner>/<repo>`                                               |
| npm へのリンク       | `@<scope>/<repo>`                                                         |
| 表示言語             | `<html lang>`、無ければパスの `/ja/`                                      |
| もう一方の言語       | ページ自身の `<link rel="alternate" hreflang>`、無ければ `/ja` の付け外し |
| 明暗                 | ヘッダより上で最初に背景色を塗っている要素                                |

どこにも一覧を持たないので、パッケージが増えてもこちら側の変更は不要です。

### 属性

すべて任意で、上の推定を1つずつ上書きします。

| 属性             | 効果                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| `repo`           | URL から判定できない場合のリポジトリ名（独自ドメインやローカルプレビュー） |
| `npm`            | パッケージ名。未公開サイトは `none`                                        |
| `owner`, `scope` | 別アカウント・別スコープの場合                                             |
| `index`          | ブランド部分のリンク先                                                     |
| `site-lang`      | `en` / `ja`。他のすべての判定より優先                                      |
| `theme`          | `light` / `dark` / `auto`（閲覧者のシステム設定に従う）                    |
| `sticky`         | スクロールしても上端に固定する                                             |

### ページ内で言語を切り替えるサイト

既定ではもう一方の言語へのリンクを出します。これは2組のページを持つサイト向けです。1ページに両言語を抱えるサイトには送り先が無いので、代わりにボタンを出し、押されたことだけを通知します。処理はページ側が行います。

```html
<turbowarp-plus-header lang-switch="buttons"></turbowarp-plus-header>
```

```js
document.addEventListener("turbowarp-plus:language", (event) => {
  applyLanguage(event.detail.lang); // "en" または "ja"
});
```

ヘッダは `<html lang>` が示す言語を選択状態にし、ボタンが押されれば自身の表示も切り替えます。

## なぜカスタム要素なのか

各サイトは、このヘッダの存在を知らないまま独自のCSSで書かれています。`svg` をすべて120pxにするサイトもあれば、リンクをすべてオレンジの極太にするサイトもあります。ページに直接貼った要素はそれらの影響を受けますし、変更のたびに全サイトへ貼り直す必要があります。Shadow DOM であれば互いに干渉せず、ここを直せば全サイトに同時に届きます。

## ビルド時に埋め込む場合

スクリプトを動かしたくないページ向けに、マークアップとスタイルシートを生成することもできます。この場合、結果はページの持ち物になり、ページ自身のCSSの影響を受けます。

```js
import {
  renderSiteHeader,
  resolveSite,
} from "@kubohiroya/turbowarp-plus-site-header";

const html = renderSiteHeader(
  resolveSite("https://kubohiroya.github.io/turbowarp-jsqr/"),
);
```

```html
<link
  rel="stylesheet"
  href="…/@kubohiroya/turbowarp-plus-site-header/dist/header.css"
/>
```

## 開発

```bash
pnpm install
npm run verify   # lint, format, typecheck, test
npm run demo     # http://localhost:4190/
```

デモページには意図的に攻撃的なCSSを置いてあります。隔離できていることを想定ではなく目で確認するためです。

## ライセンス

MPL-2.0。[LICENSE](LICENSE) を参照してください。
