package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type CompleteTaskInput struct {
	TaskID uuid.UUID
}

type CompleteTaskOutput struct {
	TaskID uuid.UUID
	Status entities.TaskStatus
}

type CompleteTaskUseCase interface {
	Execute(ctx context.Context, input CompleteTaskInput) (*CompleteTaskOutput, error)
}
