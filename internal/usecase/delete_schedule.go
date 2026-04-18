package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
)

type DeleteScheduleUseCase struct {
	scheduleRepo output.ScheduleRepository
}

func NewDeleteScheduleUseCase(scheduleRepo output.ScheduleRepository) input.DeleteScheduleUseCase {
	return &DeleteScheduleUseCase{
		scheduleRepo: scheduleRepo,
	}
}

func (uc *DeleteScheduleUseCase) Execute(ctx context.Context, req input.DeleteScheduleInput) (*input.DeleteScheduleOutput, error) {
	schedule, err := uc.scheduleRepo.GetByID(ctx, req.ID)
	if err != nil {
		return nil, fmt.Errorf("schedule not found: %w", err)
	}
	if schedule == nil {
		return nil, fmt.Errorf("schedule not found")
	}

	if err := uc.scheduleRepo.Delete(ctx, req.ID); err != nil {
		return nil, fmt.Errorf("failed to delete schedule: %w", err)
	}

	return &input.DeleteScheduleOutput{
		ID: schedule.ID,
	}, nil
}
