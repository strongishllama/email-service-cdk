package handler

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	email "github.com/gofor-little/aws-email"
	"github.com/gofor-little/log"
	"github.com/gofor-little/xerror"
)

func Handle(ctx context.Context, sqsEvent *events.SQSEvent) error {
	for _, r := range sqsEvent.Records {
		data := &email.Data{}
		if err := json.Unmarshal([]byte(r.Body), data); err != nil {
			err = xerror.Wrap("failed to unmarshal record body", err)
			log.Error(log.Fields{
				"error":        err,
				"sqsMessageId": r.MessageId,
			})

			return err
		}

		messageID, err := email.Send(ctx, *data)
		if err != nil {
			err = xerror.Wrap("failed to send email", err)
			log.Error(log.Fields{
				"error":        err,
				"sesMessageId": messageID,
				"sqsMessageId": r.MessageId,
			})

			return err
		}

		log.Info(log.Fields{
			"message":      "email successfully sent",
			"sesMessageId": messageID,
			"sqsMessageId": r.MessageId,
		})
	}

	return nil
}
