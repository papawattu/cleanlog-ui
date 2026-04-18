package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
	"cleanlog/internal/domain/entities"
)

type ListSchedulesUseCase struct {
	scheduleRepo output.ScheduleRepository
}

func NewListSchedulesUseCase(scheduleRepo output.ScheduleRepository) input.ListSchedulesUseCase {
	return &ListSchedulesUseCase{
		scheduleRepo: scheduleRepo,
	}
}

func (uc *ListSchedulesUseCase) Execute(ctx context.Context, req input.ListSchedulesInput) (*input.ListSchedulesOutput, error) {
	var schedules []*entities.Schedule
	var err error

	if req.CleanerID != nil {
		schedules, err = uc.scheduleRepo.GetByCleaner(ctx, *req.CleanerID)
	} else if req.TaskID != nil {
		schedules, err = uc.scheduleRepo.GetByTask(ctx, *req.TaskID)
	} else if req.Active != nil {
		if *req.Active {
			schedules, err = uc.scheduleRepo.ListActive(ctx)
		} else {
			return nil, fmt.Errorf("inactive schedules listing not implemented")
		}
	} else {
		return nil, fmt.Errorf("at least one filter is required")
	}

	if err != nil {
		return nil, fmt.Errorf("failed to list schedules: %w", err)
	}

	return &input.ListSchedulesOutput{Schedules: schedules}, nil
}
