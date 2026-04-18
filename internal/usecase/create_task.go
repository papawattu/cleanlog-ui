package usecases

import (
	"context"
	"fmt"
	"time"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
	"cleanlog/internal/domain/entities"
)

type CreateTaskUseCase struct {
	taskRepo output.TaskRepository
}

func NewCreateTaskUseCase(taskRepo output.TaskRepository) input.CreateTaskUseCase {
	return &CreateTaskUseCase{
		taskRepo: taskRepo,
	}
}

func (uc *CreateTaskUseCase) Execute(ctx context.Context, req input.CreateTaskInput) (*input.CreateTaskOutput, error) {
	if req.Title == "" {
		return nil, fmt.Errorf("title is required")
	}
	if len(req.Title) > 100 {
		return nil, fmt.Errorf("title must be less than 100 characters")
	}
	if len(req.Description) > 500 {
		return nil, fmt.Errorf("description must be less than 500 characters")
	}

	scheduledDate, err := time.Parse("2006-01-02", req.ScheduledDate)
	if err != nil {
		return nil, fmt.Errorf("invalid date format, use YYYY-MM-DD")
	}

	task, err := entities.NewTask(
		req.Title,
		req.Description,
		req.TaskType,
		scheduledDate,
		req.AssignedTo,
		req.CreatedBy,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create task: %w", err)
	}

	if req.ScheduledTime != nil && *req.ScheduledTime != "" {
		if err := task.SetScheduledTime(*req.ScheduledTime); err != nil {
			return nil, fmt.Errorf("failed to set scheduled time: %w", err)
		}
	}

	if err := uc.taskRepo.Create(ctx, task); err != nil {
		return nil, fmt.Errorf("failed to save task: %w", err)
	}

	return &input.CreateTaskOutput{
		ID:            task.ID,
		Title:         task.Title,
		Description:   task.Description,
		TaskType:      task.TaskType,
		Status:        task.Status,
		AssignedTo:    task.AssignedTo,
		CreatedBy:     task.CreatedBy,
		ScheduledDate: task.ScheduledDate.Format("2006-01-02"),
		ScheduledTime: task.ScheduledTime,
		CreatedAt:     task.CreatedAt,
		UpdatedAt:     task.UpdatedAt,
		CompletedAt:   task.CompletedAt,
	}, nil
}
