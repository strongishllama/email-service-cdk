package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	email "github.com/gofor-little/aws-email"
	"github.com/gofor-little/log"
	"github.com/gofor-little/xerror"

	"github.com/strongishllama/email-service-cdk/lambdas/trigger/handler"
)

func main() {
	log.Log = log.NewStandardLogger(os.Stdout, nil)

	if err := email.Initialize(context.Background(), "", ""); err != nil {
		log.Error(log.Fields{
			"error": xerror.Newf("failed to initialize the email package", err),
		})
		os.Exit(1)
	}

	lambda.Start(handler.Handle)
}
