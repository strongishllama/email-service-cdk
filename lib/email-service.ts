import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as go_lambda from '@aws-cdk/aws-lambda-go';
import * as lambda_events from '@aws-cdk/aws-lambda-event-sources';
import * as sqs from '@aws-cdk/aws-sqs';
import * as path from 'path';

export interface EmailServiceProps {
  /**
   * The default wait time for ReceiveMessage calls on the queue.
   *
   * @default 0
   */
  readonly receiveMessageWaitTime?: cdk.Duration;
}

export class EmailService extends cdk.Construct {
  public queue: sqs.Queue;
  public deadLetterQueue: sqs.Queue;

  constructor(scope: cdk.Construct, id: string, props: EmailServiceProps) {
    super(scope, id);

    // Create the queue with a dead letter queue.
    this.queue = new sqs.Queue(this, 'queue', {
      receiveMessageWaitTime: props.receiveMessageWaitTime ?? cdk.Duration.seconds(0),
      deadLetterQueue: {
        queue: new sqs.Queue(this, 'dead-letter-queue'),
        maxReceiveCount: 3
      },
    });

    // Create the function that the queue will trigger.
    const queueTriggerFunction = new go_lambda.GoFunction(this, 'function', {
      entry: path.join(__dirname, '../lambdas/trigger'),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: [
            'ses:SendRawEmail'
          ],
          resources: [
            // IAM doesn't allow locking down resources
            // on the above actions.
            '*'
          ]
        })
      ]
    });

    // Give the trigger function permission to consume the queue's messages.
    this.queue.grantConsumeMessages(queueTriggerFunction);
    // Add the queue as an event source for the trigger function.
    queueTriggerFunction.addEventSource(new lambda_events.SqsEventSource(this.queue));
  }
}
