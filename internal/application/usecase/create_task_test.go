package usecase

import (
	"cleanlog/internal/application/mocks"
	"cleanlog/internal/domain"
	"errors"
	"testing"
)

func TestCreateTaskUseCase_Execute_Success(t *testing.T) {
	taskRepo := &mocks.MockTaskRepository{
		CreateFn: func(task *domain.Task) error {
			task.ID = "123"
			return nil
		},
	}

	uc := NewCreateTaskUseCase(taskRepo)

	task, err := uc.Execute(CreateTaskInput{
		Title:       "Clean kitchen",
		Description: "Deep clean",
		Type:        domain.TaskTypeKitchen,
		ScheduledAt: "2024-04-20",
		OwnerID:     "owner-1",
	})

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if task.Title != "Clean kitchen" {
		t.Errorf("expected title 'Clean kitchen', got '%s'", task.Title)
	}

	if task.Status != domain.TaskPending {
		t.Errorf("expected status 'pending', got '%s'", task.Status)
	}
}

func TestCreateTaskUseCase_Execute_InvalidTitle(t *testing.T) {
	taskRepo := &mocks.MockTaskRepository{
		CreateFn: func(task *domain.Task) error {
			return nil
		},
	}

	uc := NewCreateTaskUseCase(taskRepo)

	_, err := uc.Execute(CreateTaskInput{
		Title:       "",
		Type:        domain.TaskTypeGeneral,
		ScheduledAt: "2024-04-20",
		OwnerID:     "owner-1",
	})

	if err == nil {
		t.Fatal("expected error for empty title")
	}
}

func TestCreateTaskUseCase_Execute_InvalidType(t *testing.T) {
	taskRepo := &mocks.MockTaskRepository{
		CreateFn: func(task *domain.Task) error {
			return nil
		},
	}

	uc := NewCreateTaskUseCase(taskRepo)

	_, err := uc.Execute(CreateTaskInput{
		Title:       "Clean kitchen",
		Type:        "invalid",
		ScheduledAt: "2024-04-20",
		OwnerID:     "owner-1",
	})

	if err == nil {
		t.Fatal("expected error for invalid type")
	}
}

func TestCreateTaskUseCase_Execute_DatabaseError(t *testing.T) {
	dbErr := errors.New("database error")
	taskRepo := &mocks.MockTaskRepository{
		CreateFn: func(task *domain.Task) error {
			return dbErr
		},
	}

	uc := NewCreateTaskUseCase(taskRepo)

	_, err := uc.Execute(CreateTaskInput{
		Title:       "Clean kitchen",
		Type:        domain.TaskTypeKitchen,
		ScheduledAt: "2024-04-20",
		OwnerID:     "owner-1",
	})

	if err == nil {
		t.Fatal("expected error for database failure")
	}
}
