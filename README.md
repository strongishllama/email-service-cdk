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

You'll also need to install the following peer dependencies. See this [article](https://dev.to/aws-builders/correctly-defining-dependencies-in-l3-cdk-constructs-45p) for more information.
```
npm install @aws-cdk/aws-iam @aws-cdk/aws-lambda-go @aws-cdk/aws-lambda-event-sources
```

## Example
```ts
// Create email service.
new EmailService(stack, 'email-service', {});
```
