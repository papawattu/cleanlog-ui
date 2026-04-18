package usecase

import (
	"cleanlog/internal/application/mocks"
	"cleanlog/internal/domain"
	"errors"
	"testing"
)

func TestAssignTaskUseCase_Execute_Success(t *testing.T) {
	task := &domain.Task{
		ID:     "task-1",
		Status: domain.TaskPending,
	}

	taskRepo := &mocks.MockTaskRepository{
		GetByIDFn: func(id string) (*domain.Task, error) {
			return task, nil
		},
		UpdateFn: func(task *domain.Task) error {
			return nil
		},
	}

	uc := NewAssignTaskUseCase(taskRepo)

	assignedTask, err := uc.Execute(AssignTaskInput{
		TaskID:    "task-1",
		CleanerID: "cleaner-1",
	})

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if assignedTask.CleanerID != "cleaner-1" {
		t.Errorf("expected cleaner_id 'cleaner-1', got '%s'", assignedTask.CleanerID)
	}
}

func TestAssignTaskUseCase_Execute_TaskNotFound(t *testing.T) {
	taskRepo := &mocks.MockTaskRepository{
		GetByIDFn: func(id string) (*domain.Task, error) {
			return nil, errors.New("not found")
		},
	}

	uc := NewAssignTaskUseCase(taskRepo)

	_, err := uc.Execute(AssignTaskInput{
		TaskID:    "nonexistent",
		CleanerID: "cleaner-1",
	})

	if err == nil {
		t.Fatal("expected error for nonexistent task")
	}
}

func TestAssignTaskUseCase_Execute_NotPending(t *testing.T) {
	task := &domain.Task{
		ID:     "task-1",
		Status: domain.TaskCompleted,
	}

	taskRepo := &mocks.MockTaskRepository{
		GetByIDFn: func(id string) (*domain.Task, error) {
			return task, nil
		},
	}

	uc := NewAssignTaskUseCase(taskRepo)

	_, err := uc.Execute(AssignTaskInput{
		TaskID:    "task-1",
		CleanerID: "cleaner-1",
	})

	if err == nil {
		t.Fatal("expected error for non-pending task")
	}
}

func TestAssignTaskUseCase_Execute_DatabaseError(t *testing.T) {
	task := &domain.Task{
		ID:     "task-1",
		Status: domain.TaskPending,
	}

	dbErr := errors.New("database error")
	taskRepo := &mocks.MockTaskRepository{
		GetByIDFn: func(id string) (*domain.Task, error) {
			return task, nil
		},
		UpdateFn: func(task *domain.Task) error {
			return dbErr
		},
	}

	uc := NewAssignTaskUseCase(taskRepo)

	_, err := uc.Execute(AssignTaskInput{
		TaskID:    "task-1",
		CleanerID: "cleaner-1",
	})

	if err == nil {
		t.Fatal("expected database error")
	}
}
