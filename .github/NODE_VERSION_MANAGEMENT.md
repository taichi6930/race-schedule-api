# Node.jsバージョン管理ガイド

このプロジェクトでは、Node.jsのバージョンを`.nvmrc`ファイルで一元管理しています。

## バージョンの確認

現在のNode.jsバージョンは`.nvmrc`ファイルで確認できます：

```bash
cat .nvmrc
```

## 開発環境でのセットアップ

### nvmを使用する場合

```bash
# プロジェクトルートで実行
nvm use

# 指定バージョンがインストールされていない場合
nvm install
```

### その他のNode.jsバージョンマネージャー

- **nodenv**: 自動的に`.nvmrc`を読み込みます
- **asdf**: `.tool-versions`ファイルを作成するか、`.nvmrc`プラグインを使用
- **volta**: `volta pin node@$(cat .nvmrc)` を実行

## CI/CD環境

GitHub Actionsでは、すべてのワークフローとアクションが`.nvmrc`を自動的に読み込むように設定されています：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
      node-version-file: '.nvmrc'
```

## Node.jsバージョンの更新手順

Node.jsバージョンを更新する場合は、以下の手順に従ってください：

### 1. `.nvmrc`ファイルを更新

```bash
echo "24.3.0" > .nvmrc
```

### 2. `package.json`の`engines.node`を更新

`.nvmrc`と一致するように更新します：

```json
{
    "engines": {
        "node": ">=24.3.0 <25.0.0"
    }
}
```

### 3. 動作確認

```bash
# 新しいバージョンを使用
nvm use

# 依存関係を再インストール
bun install

# テストを実行
bun test

# Lintとtype-checkを実行
bun run pre-commit
```

### 4. コミットとプッシュ

```bash
git add .nvmrc package.json bun.lockb
git commit -m "chore: Update Node.js to $(cat .nvmrc)"
git push
```

### 5. CI/CDの動作確認

プルリクエストのCI/CDチェックが全て通ることを確認してください。

## トラブルシューティング

### ローカル環境でNode.jsバージョンが異なる

```bash
# 現在のバージョンを確認
node -v

# .nvmrcのバージョンに切り替え
nvm use

# または強制的にインストール
nvm install $(cat .nvmrc)
nvm use
```

### CI/CDでバージョンエラーが発生

1. `.nvmrc`ファイルが正しくコミットされているか確認
2. GitHub Actionsのキャッシュをクリアしてから再実行
3. `package.json`の`engines.node`と`.nvmrc`が一致しているか確認

## 参考リンク

- [Node.js リリーススケジュール](https://github.com/nodejs/release#release-schedule)
- [nvm ドキュメント](https://github.com/nvm-sh/nvm)
- [actions/setup-node ドキュメント](https://github.com/actions/setup-node)
