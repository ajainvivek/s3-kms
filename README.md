# AWS S3 KMS Playground

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

```
npm run start:infra
```

Destroys the local AWS infrastructure

```
npm run destroy:infra
```

## Execute 

- Download S3 files recursively & download to the local machine

```
npm run start:download
```

### Benchmark Tests

These tests have been ran and reported on Mac OSX v10.14.5 15 inch 2.8 GHz Intel Core i7

- Copy files recursively on local machine 

```js
====================== sortBy ======================
Slow  Promise.all            31 sec/62kb      3 samples
      Promise.map(Infinity)  27.34 sec/62kb   3 samples
Fast  Promise.map(3)         29.29 sec/62kb   3 samples
```

## TODO

- [x] Add prettier, eslint
- [x] Add jest for unit test
- [x] Add aws-sdk, bluebird
- [x] Setup AWS infrastructure (S3 + SSE KMS Encyption with CMK)
- [x] Setup localstack for local AWS environment
- [x] Copy files recursively on local machine from S3
- [ ] Upload the files to S3 using SSE with KMS
- [ ] Unit + Integration tests
- [ ] Performance, stress testing