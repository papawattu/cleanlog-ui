package usecase

import "cleanlog/internal/domain"

type CreateTaskInput struct {
	Title       string
	Description string
	Type        domain.TaskType
	ScheduledAt string
	OwnerID     string
}

type CreateTaskUseCase struct {
	taskRepo domain.TaskRepository
}

func NewCreateTaskUseCase(taskRepo domain.TaskRepository) *CreateTaskUseCase {
	return &CreateTaskUseCase{taskRepo: taskRepo}
}

func (uc *CreateTaskUseCase) Execute(input CreateTaskInput) (*domain.Task, error) {
	task := &domain.Task{
		Title:       input.Title,
		Description: input.Description,
		Type:        input.Type,
		ScheduledAt: input.ScheduledAt,
		OwnerID:     input.OwnerID,
		Status:      domain.TaskPending,
	}

	task.GenerateID()

	if err := task.Validate(); err != nil {
		return nil, err
	}

	if err := uc.taskRepo.Create(task); err != nil {
		return nil, err
	}

	return task, nil
}
