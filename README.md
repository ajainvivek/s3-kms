# AWS S3 KMS Playground

Download all objects in a given S3 bucket recursively and save them locally, maintain directory structure. Encrypt all downloaded objects using KMS with a user-defined CMK and upload them to a second S3 bucket.
 
## TODO

- [x] Add prettier, eslint
- [x] Add jest for unit test
- [x] Add aws-sdk, bluebird
- [x] Setup AWS infrastructure (S3 + KMS)
- [ ] Setup localstack for local AWS environment
- [ ] Draft initial implementation
- [ ] Unit + Integration tests
- [ ] Performance, stress testing