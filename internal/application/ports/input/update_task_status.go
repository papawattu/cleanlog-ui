package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type UpdateTaskStatusInput struct {
	TaskID uuid.UUID
	Status entities.TaskStatus
}

type UpdateTaskStatusOutput struct {
	TaskID uuid.UUID
	Status entities.TaskStatus
}

type UpdateTaskStatusUseCase interface {
	Execute(ctx context.Context, input UpdateTaskStatusInput) (*UpdateTaskStatusOutput, error)
}
