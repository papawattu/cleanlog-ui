package ports

import (
	"context"

	"github.com/google/uuid"
)

type DeleteTaskInput struct {
	TaskID uuid.UUID
}

type DeleteTaskOutput struct {
	TaskID uuid.UUID
}

type DeleteTaskUseCase interface {
	Execute(ctx context.Context, input DeleteTaskInput) (*DeleteTaskOutput, error)
}
