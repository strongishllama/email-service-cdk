package handler_test

import (
	"context"
	"encoding/json"
	"strings"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	email "github.com/gofor-little/aws-email"
	"github.com/gofor-little/env"
	"github.com/stretchr/testify/require"

	"github.com/strongishllama/email-service-cdk/lambdas/trigger/handler"
)

func TestHandle(t *testing.T) {
	if err := env.Load(".env"); err != nil {
		t.Log(".env file not found, ignore this if running in CI/CD Pipeline")
	}

	to, err := env.MustGet("TEST_EMAIL_RECIPIENTS")
	require.NoError(t, err)

	from, err := env.MustGet("TEST_EMAIL_FROM")
	require.NoError(t, err)

	require.NoError(t, email.Initialize(context.Background(), env.Get("AWS_PROFILE", "default"), env.Get("AWS_REGION", "ap-southeast-2")))

	body, err := json.Marshal(&email.Data{
		To:          strings.Split(to, ","),
		From:        from,
		Subject:     "Test Subject",
		Body:        "Test Body",
		ContentType: email.ContentTypeTextPlain,
	})
	require.NoError(t, err)

	require.NoError(t, handler.Handle(context.Background(), &events.SQSEvent{
		Records: []events.SQSMessage{
			{Body: string(body)},
		},
	}))
}
