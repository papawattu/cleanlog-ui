package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type ListSchedulesInput struct {
	TaskID    *uuid.UUID
	CleanerID *uuid.UUID
	Active    *bool
}

type ListSchedulesOutput struct {
	Schedules []*entities.Schedule
}

type ListSchedulesUseCase interface {
	Execute(ctx context.Context, input ListSchedulesInput) (*ListSchedulesOutput, error)
}
