package usecase

import (
	"cleanlog/internal/domain"
)

type GetCleanerTasksInput struct {
	CleanerID string
}

type GetCleanerTasksUseCase struct {
	taskRepo domain.TaskRepository
}

func NewGetCleanerTasksUseCase(taskRepo domain.TaskRepository) *GetCleanerTasksUseCase {
	return &GetCleanerTasksUseCase{taskRepo: taskRepo}
}

func (uc *GetCleanerTasksUseCase) Execute(input GetCleanerTasksInput) ([]*domain.Task, error) {
	tasks, err := uc.taskRepo.FindByCleanerID(input.CleanerID)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}
