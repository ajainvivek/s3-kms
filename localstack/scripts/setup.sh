
#!/bin/bash

set -ex

# CREATE S3 BUCKET 
# list buckets: aws --region=us-west-2 --endpoint-url=http://localhost:4572 s3api list-buckets
# list objects: aws --region=us-west-2 --endpoint-url=http://localhost:4572 s3api list-objects --bucket az-normal-bucket
aws --region=us-west-2 --endpoint-url=http://localstack:4572  s3 mb s3://az-normal-bucket       
echo "created S3 bucket - s3://az-normal-bucket"
aws --region=us-west-2 --endpoint-url=http://localstack:4572 s3 mb s3://az-encrypted-bucket
echo "created S3 bucket - s3://az-encrypted-bucket"

# COPY FILES TO DOWNLOAD BUCKET
aws s3 sync /app/sample/my-project s3://az-normal-bucket --endpoint=http://localstack:4572
echo "copied component tokens into s3://az-normal-bucket"

# PUT SSE KMS ENCRYPTION ON BUCKET
# get bucket encryption: aws --region=us-west-2 --endpoint-url=http://localhost:4572 s3api get-bucket-encryption --bucket az-encrypted-bucket --query 'ServerSideEncryptionConfiguration.Rules[*].ApplyServerSideEncryptionByDefault'
aws --region=us-west-2 --endpoint-url=http://localstack:4572 s3api put-bucket-encryption --bucket az-encrypted-bucket --server-side-encryption-configuration file://sse-kms-config.json