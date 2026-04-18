package ports

import (
	"context"

	"github.com/google/uuid"
)

type DeleteScheduleInput struct {
	ID uuid.UUID
}

type DeleteScheduleOutput struct {
	ID uuid.UUID
}

type DeleteScheduleUseCase interface {
	Execute(ctx context.Context, input DeleteScheduleInput) (*DeleteScheduleOutput, error)
}
