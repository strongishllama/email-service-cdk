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
}

export class EmailService extends cdk.Construct {
  public queueArn: string;
  public deadLetterQueueArn: string;

  constructor(scope: cdk.Construct, id: string, props: EmailServiceProps) {
    super(scope, id);

    // Create the dead letter queue.
    const deadLetterQueue = new sqs.Queue(this, `${props.prefix}-dead-letter-queue-${props.suffix}`);
    this.deadLetterQueueArn = deadLetterQueue.queueArn;

    // Create the queue.
    const queue = new sqs.Queue(this, `${props.prefix}-queue-${props.suffix}`, {
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3
      }
    });
    this.queueArn = queue.queueArn;

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
    queue.grantConsumeMessages(queueTriggerFunction);
    // Add the queue as an event source for the trigger function.
    queueTriggerFunction.addEventSource(new lambda_events.SqsEventSource(queue));
  }
}
