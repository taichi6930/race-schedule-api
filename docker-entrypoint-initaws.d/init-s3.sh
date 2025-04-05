#!/bin/bash

# S3バケットの作成
awslocal s3 mb s3://race-schedule-bucket

# モックデータをアップロード
awslocal s3 cp /docker-entrypoint-initaws.d/mockData/csv/ s3://race-schedule-bucket/ --recursive

# バケットの作成を確認
awslocal s3 ls