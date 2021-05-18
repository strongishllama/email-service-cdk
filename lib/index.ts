import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda-go';
import * as lambda_events from '@aws-cdk/aws-lambda-event-sources';
import * as sqs from '@aws-cdk/aws-sqs';
import * as path from 'path';

export interface EmailServiceProps {
  /**
   * The prefix that will be added at the start of every resource id.
   */
  prefix: string;
  /**
   * The suffix that will be added at the end of every resource id.
   */
  suffix: string;
  /**
   * The resources that will have permission to add messages to the email queue.
   */
  sendMessageArns: string[];
}

export class EmailService extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EmailServiceProps) {
    super(scope, id);

    // Create the queue.
    const emailQueue = new sqs.Queue(this, `${props.prefix}-queue-${props.suffix}`, {
      deadLetterQueue: {
        queue: new sqs.Queue(this, `${props.prefix}-dead-letter-queue-${props.suffix}`),
        maxReceiveCount: 3
      }
    });

    // Build array of principals from the sendMessageArns.
    let sendMessagePrincipals: iam.ArnPrincipal[] = [];
    props.sendMessageArns.forEach(s => {
      sendMessagePrincipals.push(new iam.ArnPrincipal(s))
    });

    // Give permission to add messages to the queue.
    emailQueue.addToResourcePolicy(new iam.PolicyStatement({
      actions: [
        'SQS:SendMessage'
      ],
      principals: sendMessagePrincipals,
      resources: props.sendMessageArns
    }));

    // Create the function that the queue will trigger.
    const queueTriggerFunction = new lambda.GoFunction(this, `${props.prefix}-function-${props.suffix}`, {
      entry: path.join(__dirname, '../lambdas/trigger'),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: [
            'ses:SendRawEmail'
          ],
          resources: [
            '*'
          ]
        })
      ]
    });

    // Give the trigger function permission to consume the queue's messages.
    emailQueue.grantConsumeMessages(queueTriggerFunction);
    // Add the queue as an event source for the trigger function.
    queueTriggerFunction.addEventSource(new lambda_events.SqsEventSource(emailQueue));
  }
}
