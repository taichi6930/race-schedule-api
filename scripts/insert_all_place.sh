#!/bin/zsh
set -e


# SQLファイル生成
ts-node scripts/insert_place_from_all_csv.ts

# DB投入
for f in scripts/insert_place_*.sql; do
  echo "Importing $f ..."
  npx wrangler d1 execute my-database --file "$f"
  echo "Done: $f"
done

# 生成したSQLファイルを削除
rm scripts/insert_place_*.sql
