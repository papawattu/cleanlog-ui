package ports

import (
	"context"
	"time"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type CreateTaskInput struct {
	Title         string
	Description   string
	TaskType      entities.TaskType
	ScheduledDate string
	AssignedTo    uuid.UUID
	CreatedBy     uuid.UUID
	ScheduledTime *string
}

type CreateTaskOutput struct {
	ID            uuid.UUID
	Title         string
	Description   string
	TaskType      entities.TaskType
	Status        entities.TaskStatus
	AssignedTo    uuid.UUID
	CreatedBy     uuid.UUID
	ScheduledDate string
	ScheduledTime *string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	CompletedAt   *time.Time
}

type CreateTaskUseCase interface {
	Execute(ctx context.Context, input CreateTaskInput) (*CreateTaskOutput, error)
}
