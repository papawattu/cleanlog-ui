package usecase

import (
	"cleanlog/internal/domain"
	"fmt"
)

type AssignTaskInput struct {
	TaskID    string
	CleanerID string
}

type AssignTaskUseCase struct {
	taskRepo domain.TaskRepository
}

func NewAssignTaskUseCase(taskRepo domain.TaskRepository) *AssignTaskUseCase {
	return &AssignTaskUseCase{taskRepo: taskRepo}
}

func (uc *AssignTaskUseCase) Execute(input AssignTaskInput) (*domain.Task, error) {
	task, err := uc.taskRepo.GetByID(input.TaskID)
	if err != nil {
		return nil, fmt.Errorf("task not found")
	}

	if task.Status != domain.TaskPending {
		return nil, fmt.Errorf("only pending tasks can be assigned")
	}

	task.CleanerID = input.CleanerID
	if err := uc.taskRepo.Update(task); err != nil {
		return nil, err
	}

	return task, nil
}
