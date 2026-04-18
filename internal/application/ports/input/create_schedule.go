package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type CreateScheduleInput struct {
	TaskID    uuid.UUID
	CleanerID uuid.UUID
	Date      string
	TimeSlot  entities.TimeSlot
}

type CreateScheduleOutput struct {
	ID uuid.UUID
}

type CreateScheduleUseCase interface {
	Execute(ctx context.Context, input CreateScheduleInput) (*CreateScheduleOutput, error)
}
