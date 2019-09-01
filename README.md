# AWS S3 KMS Playground

[![Build Status](https://travis-ci.org/ajainvivek/s3-kms.svg?branch=master)](https://travis-ci.org/ajainvivek/s3-kms)

Download all objects in a given S3 bucket recursively and save them locally, maintain directory structure. Encrypt all downloaded objects using KMS with a user-defined CMK and upload them to a second S3 bucket.

## Setting Up Local Codebase

Install packages

```
npm i
```

Run Linting

```
npm run lint
npm run lint:fix
```

Run Tests

```
npm run test
```

## Local AWS Infrastructure Setup

- Spins up local AWS infrastructure via localstack along with S3 + KMS bootstrap
- Refer `/localstack/scripts/setup.sh` for  bootstrap
- Make sure `docker` is running on your local machine before spinning up localstack

```
npm run start:infra
```

Destroys the local AWS infrastructure

```
npm run destroy:infra
```

## How to run  

- Download S3 files recursively & download to the local machine

```
npm run start:download
```

- Upload files to KMS encrypted bucket 

```
npm run start:upload
```

## How to test

- Copy `.env.sample` to `.env` for configuration
- To test on AWS update the configuration file
- To test on local machine, spin up local stack, follow infra commands above
- Local infrastructure `localstack/scripts/setup.sh` comprises of the bootstrap script to run aws cli (Note: KMS is not supported in localstack)
- Download & upload files has it's own script command

## KMS with CMK

- Create access policy to manage CMK & encrypt S3 objects
- Create KMS key with the policy
```
    aws kms create-key --region us-west-2 --policy file://kms-policy.json
```
- Configure the S3 bucket SSE
```
    aws --region=us-west-2 --endpoint-url=http://localstack:4572 s3api put-bucket-encryption --bucket encrypted-bucket --server-side-encryption-confi
```

### Benchmark Tests

These tests have been ran and reported on Mac OSX v10.14.5 15 inch 2.8 GHz Intel Core i7

- Copy files recursively on local machine // dir size: 62kb

```js
====================== sortBy ======================
Slow  Promise.all            31 ms/op      3 samples
      Promise.map(3)         29.29 ms/op   3 samples
Fast  Promise.map(Infinity)  27.34 ms/op   3 samples

```

- Upload files from local to S3 // dir size: 62kb

```js
====================== sortBy ======================
Slow  Promise.map(Infinity)     29.06 ms/op   6 samples
      Promise.map(10)           28.40 ms/op   6 samples      
Fast  Promise.map(3)            26.91 ms/op   6 samples
```

## TODO

- [x] Add prettier, eslint
- [x] Add jest for unit test
- [x] Add aws-sdk, bluebird
- [x] Setup AWS infrastructure (S3 + SSE KMS Encyption with CMK)
- [x] Setup localstack for local AWS environment
- [x] Copy files recursively on local machine from S3
- [x] Unit tests for copy files
- [x] Performance benchmark tests for copy
- [x] Upload the files to S3 using SSE with KMS
- [x] Unit test for upload files
- [x] Performance benchmark tests for upload