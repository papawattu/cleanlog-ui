package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type UpdateScheduleInput struct {
	ID       uuid.UUID
	TimeSlot *entities.TimeSlot
	Active   *bool
}

type UpdateScheduleOutput struct {
	ID       uuid.UUID
	TimeSlot entities.TimeSlot
	Active   bool
}

type UpdateScheduleUseCase interface {
	Execute(ctx context.Context, input UpdateScheduleInput) (*UpdateScheduleOutput, error)
}
