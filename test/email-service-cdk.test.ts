import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EmailService from '../lib/index';

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // GIVEN
  const stack = new cdk.Stack(app, 'TestStack');
  // WHEN
  new EmailService.EmailService(stack, 'MyTestConstruct', {
    prefix: '',
    suffix: '',
    sendMessageArns: []
  });
  // THEN
  expectCDK(stack).to(countResources('AWS::SNS::Topic',0));
});
