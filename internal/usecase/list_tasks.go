package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
	"cleanlog/internal/domain/entities"
)

type ListTasksUseCase struct {
	taskRepo output.TaskRepository
}

func NewListTasksUseCase(taskRepo output.TaskRepository) input.ListTasksUseCase {
	return &ListTasksUseCase{
		taskRepo: taskRepo,
	}
}

func (uc *ListTasksUseCase) Execute(ctx context.Context, req input.ListTasksInput) (*input.ListTasksOutput, error) {
	var tasks []*entities.Task
	var err error

	if req.CleanerID != nil {
		tasks, err = uc.taskRepo.GetByCleaner(ctx, *req.CleanerID)
	} else if req.OwnerID != nil {
		tasks, err = uc.taskRepo.GetByOwner(ctx, *req.OwnerID)
	} else if req.Status != nil {
		tasks, err = uc.taskRepo.GetByStatus(ctx, *req.Status)
	} else {
		return nil, fmt.Errorf("at least one filter is required")
	}

	if err != nil {
		return nil, fmt.Errorf("failed to list tasks: %w", err)
	}

	return &input.ListTasksOutput{Tasks: tasks}, nil
}
