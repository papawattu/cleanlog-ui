package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
)

type DeleteTaskUseCase struct {
	taskRepo output.TaskRepository
}

func NewDeleteTaskUseCase(taskRepo output.TaskRepository) input.DeleteTaskUseCase {
	return &DeleteTaskUseCase{
		taskRepo: taskRepo,
	}
}

func (uc *DeleteTaskUseCase) Execute(ctx context.Context, req input.DeleteTaskInput) (*input.DeleteTaskOutput, error) {
	task, err := uc.taskRepo.GetByID(ctx, req.TaskID)
	if err != nil {
		return nil, fmt.Errorf("task not found: %w", err)
	}
	if task == nil {
		return nil, fmt.Errorf("task not found")
	}

	if err := uc.taskRepo.Delete(ctx, req.TaskID); err != nil {
		return nil, fmt.Errorf("failed to delete task: %w", err)
	}

	return &input.DeleteTaskOutput{TaskID: req.TaskID}, nil
}
