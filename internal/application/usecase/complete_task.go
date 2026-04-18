package usecase

import (
	"cleanlog/internal/domain"
	"fmt"
)

type CompleteTaskInput struct {
	TaskID string
}

type CompleteTaskUseCase struct {
	taskRepo domain.TaskRepository
}

func NewCompleteTaskUseCase(taskRepo domain.TaskRepository) *CompleteTaskUseCase {
	return &CompleteTaskUseCase{taskRepo: taskRepo}
}

func (uc *CompleteTaskUseCase) Execute(input CompleteTaskInput) (*domain.Task, error) {
	task, err := uc.taskRepo.GetByID(input.TaskID)
	if err != nil {
		return nil, fmt.Errorf("task not found")
	}

	if task.Status == domain.TaskCompleted {
		return nil, fmt.Errorf("task already completed")
	}

	task.Status = domain.TaskCompleted
	if err := uc.taskRepo.Update(task); err != nil {
		return nil, err
	}

	return task, nil
}
