package usecase

import (
	"cleanlog/internal/domain"
)

type GetOwnerTasksInput struct {
	OwnerID string
}

type GetOwnerTasksUseCase struct {
	taskRepo domain.TaskRepository
}

func NewGetOwnerTasksUseCase(taskRepo domain.TaskRepository) *GetOwnerTasksUseCase {
	return &GetOwnerTasksUseCase{taskRepo: taskRepo}
}

func (uc *GetOwnerTasksUseCase) Execute(input GetOwnerTasksInput) ([]*domain.Task, error) {
	tasks, err := uc.taskRepo.FindByOwnerID(input.OwnerID)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}
