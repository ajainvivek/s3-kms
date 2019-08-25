
#!/bin/bash

set -ex

# CREATE S3 BUCKET 
# list buckets: aws --region=us-west-2 --endpoint-url=http://localhost:4572 s3api list-buckets
# list objects: aws --region=us-west-2 --endpoint-url=http://localhost:4572 s3api list-objects --bucket my_download
aws --region=us-west-2 --endpoint-url=http://localstack:4572 s3 mb s3://my-download
echo "created S3 bucket - s3://my-download"
aws --region=us-west-2 --endpoint-url=http://localstack:4572 s3 mb s3://my-upload
echo "created S3 bucket - s3://my-upload"

# COPY FILES TO DOWNLOAD BUCKET
aws s3 sync /src/fake/my-project s3://my-download --endpoint=http://localstack:4572
echo "copied component tokens into s3://my-download"