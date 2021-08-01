import * as assert from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { EmailService, EmailServiceProps } from '../lib';

test('Email Service', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'test-stack');
  const props: EmailServiceProps = {
    namespace: 'test',
    stage: 'test',
  };
  // WHEN
  new EmailService(stack, 'email-service', props);
  // THEN
  assert.expect(stack).to(assert.countResources('AWS::SQS::Queue', 2));
  assert.expect(stack).to(assert.haveResourceLike('AWS::SQS::Queue', {
    'ReceiveMessageWaitTimeSeconds': props.receiveMessageWaitTime ?? 0,
    'RedrivePolicy': {
      'deadLetterTargetArn': {
        'Fn::GetAtt': []
      },
      'maxReceiveCount': 3
    }
  }));
  assert.expect(stack).to(assert.haveResourceLike('AWS::Lambda::Function'));
});
