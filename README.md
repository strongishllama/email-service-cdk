# Email Service CDK

![GitHub tag (latest SemVer pre-release)](https://img.shields.io/github/v/tag/strongishllama/email-service-cdk?include_prereleases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/strongishllama/email-service-cdk/main/LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/strongishllama/email-service-cdk/Release)

## Introduction
* Serverless email queue via SQS and SES.
* Dead letter queue support.

## Installation
```
npm install @strongishllama/email-service-cdk
```

## Example
```ts
// Create email service.
new EmailService(stack, 'email-service', {
  namespace: 'example',
  stage: 'prod',
});
```
