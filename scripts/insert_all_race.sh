#!/bin/zsh
set -e

# SQLファイル生成
ts-node scripts/insert_race_from_all_csv.ts

# DB投入
for f in scripts/insert_race_*.sql; do
  echo "Importing $f ..."
  npx wrangler d1 execute my-database --local --file "$f"
  echo "Done: $f"
done
