package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
)

type UpdateScheduleUseCase struct {
	scheduleRepo output.ScheduleRepository
}

func NewUpdateScheduleUseCase(scheduleRepo output.ScheduleRepository) input.UpdateScheduleUseCase {
	return &UpdateScheduleUseCase{
		scheduleRepo: scheduleRepo,
	}
}

func (uc *UpdateScheduleUseCase) Execute(ctx context.Context, req input.UpdateScheduleInput) (*input.UpdateScheduleOutput, error) {
	schedule, err := uc.scheduleRepo.GetByID(ctx, req.ID)
	if err != nil {
		return nil, fmt.Errorf("schedule not found: %w", err)
	}
	if schedule == nil {
		return nil, fmt.Errorf("schedule not found")
	}

	if req.TimeSlot != nil {
		if err := schedule.UpdateTimeSlot(*req.TimeSlot); err != nil {
			return nil, fmt.Errorf("failed to update time slot: %w", err)
		}
	}

	if req.Active != nil {
		if *req.Active {
			if err := schedule.Reactivate(); err != nil {
				return nil, fmt.Errorf("failed to reactivate schedule: %w", err)
			}
		} else {
			if err := schedule.Deactivate(); err != nil {
				return nil, fmt.Errorf("failed to deactivate schedule: %w", err)
			}
		}
	}

	if err := uc.scheduleRepo.Update(ctx, schedule); err != nil {
		return nil, fmt.Errorf("failed to update schedule: %w", err)
	}

	return &input.UpdateScheduleOutput{
		ID:       schedule.ID,
		TimeSlot: schedule.TimeSlot,
		Active:   schedule.Active,
	}, nil
}
