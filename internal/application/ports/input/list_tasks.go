package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type ListTasksInput struct {
	CleanerID *uuid.UUID
	OwnerID   *uuid.UUID
	Status    *entities.TaskStatus
}

type ListTasksOutput struct {
	Tasks []*entities.Task
}

type ListTasksUseCase interface {
	Execute(ctx context.Context, input ListTasksInput) (*ListTasksOutput, error)
}
