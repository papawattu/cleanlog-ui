package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
)

type UpdateTaskStatusUseCase struct {
	taskRepo output.TaskRepository
}

func NewUpdateTaskStatusUseCase(taskRepo output.TaskRepository) input.UpdateTaskStatusUseCase {
	return &UpdateTaskStatusUseCase{
		taskRepo: taskRepo,
	}
}

func (uc *UpdateTaskStatusUseCase) Execute(ctx context.Context, req input.UpdateTaskStatusInput) (*input.UpdateTaskStatusOutput, error) {
	task, err := uc.taskRepo.GetByID(ctx, req.TaskID)
	if err != nil {
		return nil, fmt.Errorf("task not found: %w", err)
	}
	if task == nil {
		return nil, fmt.Errorf("task not found")
	}

	if err := task.SetStatus(req.Status); err != nil {
		return nil, fmt.Errorf("failed to update status: %w", err)
	}

	if err := uc.taskRepo.Update(ctx, task); err != nil {
		return nil, fmt.Errorf("failed to update task: %w", err)
	}

	return &input.UpdateTaskStatusOutput{
		TaskID: task.ID,
		Status: task.Status,
	}, nil
}
