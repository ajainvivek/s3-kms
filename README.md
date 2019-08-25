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

Spins up local AWS infrastructure via localstack along with initial setup 

```
npm run start:infra
```

Destroys the local AWS infrastructure

```
npm run destroy:infra
```
 
## TODO

- [x] Add prettier, eslint
- [x] Add jest for unit test
- [x] Add aws-sdk, bluebird
- [x] Setup AWS infrastructure (S3 + KMS)
- [x] Setup localstack for local AWS environment
- [ ] Draft initial implementation
- [ ] Unit + Integration tests
- [ ] Performance, stress testing