package usecases

import (
	"context"
	"fmt"
	"time"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
	"cleanlog/internal/domain/entities"
)

type CreateScheduleUseCase struct {
	scheduleRepo output.ScheduleRepository
	taskRepo     output.TaskRepository
}

func NewCreateScheduleUseCase(scheduleRepo output.ScheduleRepository, taskRepo output.TaskRepository) input.CreateScheduleUseCase {
	return &CreateScheduleUseCase{
		scheduleRepo: scheduleRepo,
		taskRepo:     taskRepo,
	}
}

func (uc *CreateScheduleUseCase) Execute(ctx context.Context, req input.CreateScheduleInput) (*input.CreateScheduleOutput, error) {
	task, err := uc.taskRepo.GetByID(ctx, req.TaskID)
	if err != nil {
		return nil, fmt.Errorf("task not found: %w", err)
	}
	if task == nil {
		return nil, fmt.Errorf("task not found")
	}

	scheduledDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, fmt.Errorf("invalid date format, use YYYY-MM-DD")
	}

	schedule, err := entities.NewSchedule(req.TaskID, req.CleanerID, scheduledDate, req.TimeSlot)
	if err != nil {
		return nil, fmt.Errorf("failed to create schedule: %w", err)
	}

	if err := uc.scheduleRepo.Create(ctx, schedule); err != nil {
		return nil, fmt.Errorf("failed to save schedule: %w", err)
	}

	return &input.CreateScheduleOutput{
		ID: schedule.ID,
	}, nil
}
