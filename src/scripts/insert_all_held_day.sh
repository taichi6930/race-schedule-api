#!/bin/zsh
set -e

# SQLファイル生成
ts-node scripts/insert_held_day_from_all_csv.ts

# DB投入
for f in scripts/insert_held_day_*.sql; do
  echo "Importing $f ..."
  npx wrangler d1 execute my-database --local --file "$f"
  # 10秒待機
  echo "Done: $f"
done
