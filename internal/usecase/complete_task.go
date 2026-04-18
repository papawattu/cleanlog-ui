package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
)

type CompleteTaskUseCase struct {
	taskRepo output.TaskRepository
}

func NewCompleteTaskUseCase(taskRepo output.TaskRepository) input.CompleteTaskUseCase {
	return &CompleteTaskUseCase{
		taskRepo: taskRepo,
	}
}

func (uc *CompleteTaskUseCase) Execute(ctx context.Context, req input.CompleteTaskInput) (*input.CompleteTaskOutput, error) {
	task, err := uc.taskRepo.GetByID(ctx, req.TaskID)
	if err != nil {
		return nil, fmt.Errorf("task not found: %w", err)
	}
	if task == nil {
		return nil, fmt.Errorf("task not found")
	}

	if err := task.MarkCompleted(); err != nil {
		return nil, fmt.Errorf("failed to complete task: %w", err)
	}

	if err := uc.taskRepo.Update(ctx, task); err != nil {
		return nil, fmt.Errorf("failed to update task: %w", err)
	}

	return &input.CompleteTaskOutput{
		TaskID: task.ID,
		Status: task.Status,
	}, nil
}
