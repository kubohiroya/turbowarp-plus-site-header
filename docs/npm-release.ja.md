# npm公開

@kubohiroya/turbowarp-plus-site-header は public package として配布する。公開処理は .github/workflows/release.yml を使う。

## 公開前

- 固定したcommitの差分・版・配布対象と検証結果を確認する。
- npm側でowner kubohiroya、repository turbowarp-plus-site-header、workflow release.ymlのTrusted Publisherを設定する。未設定のままtokenへ自動fallbackしない。初回のpackage登録・認証が必要ならCLIをTTYで起動し、ユーザーのローカルブラウザで完了する。
- 同じ版が未使用であることを確認する。公開内容とGitHub tag/Releaseを承認後、mainに反映したcommitへ v0.1.0 のようなtagを作成する。

## 実行と確認

- tag pushまたは既存tagをrefに指定したworkflow_dispatchで実行する。checkoutのSHAとGitHub実行contextのSHAも一致させる。
- package名・版・tag SHAを照合し、registryの通信失敗を未公開と誤認しない。
- prepackの全体検証に成功したものだけnpm publishする。既存版は上書きせずskipする。
- 成功後にnpmの版・provenance・source commit、GitHub tag/Release、配布内容を照合する。

## 切戻し

公開前はrevertする。公開済みの版・tagは移動・上書き・削除せず、別番号で修正する。

Refs: https://github.com/kubohiroya/turbowarp-plus-packages/issues/130

## 初回の登録

Trusted Publisherを設定するにはregistryにpackageが存在する必要がある。初回は実版をローカルから公開せず、承認済みの登録専用bootstrap（版0.0.0、READMEのみ）をnpm stage publishで登録する。npmが作るpublicな0.0.0-stage placeholderと、まだ公開されない登録用stageの存在も承認範囲に含める。

次にrelease.ymlへのTrusted Publisherを作り、実版はCIからprovenance付きで公開する。実版の公開確認後、今回作成した登録専用stageだけをrejectする。既存の公開版は削除しない。npmのWeb認証はTTYからOSの既定ブラウザを開き、ユーザーに引き渡す。

- [npm trustの前提条件](https://docs.npmjs.com/cli/v11/commands/npm-trust/)
- [新規packageのstaged publishing](https://docs.npmjs.com/staged-publishing/)
