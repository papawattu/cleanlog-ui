package usecases_test

import (
	"context"
	"errors"
	"testing"
	"time"

	input "cleanlog/internal/application/ports/input"
	"cleanlog/internal/domain/entities"
	"cleanlog/internal/usecase"
	"github.com/google/uuid"
)

type mockTaskRepo struct {
	tasks map[uuid.UUID]*entities.Task
	err   error
}

func newMockTaskRepo() *mockTaskRepo {
	return &mockTaskRepo{
		tasks: make(map[uuid.UUID]*entities.Task),
	}
}

func (m *mockTaskRepo) SetTasks(tasks []*entities.Task) {
	m.tasks = make(map[uuid.UUID]*entities.Task)
	for _, task := range tasks {
		m.tasks[task.ID] = task
	}
}

func (m *mockTaskRepo) Create(ctx context.Context, task *entities.Task) error {
	return m.err
}

func (m *mockTaskRepo) GetByID(ctx context.Context, id uuid.UUID) (*entities.Task, error) {
	if m.err != nil {
		return nil, m.err
	}
	task, ok := m.tasks[id]
	if !ok {
		return nil, nil
	}
	return task, nil
}

func (m *mockTaskRepo) GetByStatus(ctx context.Context, status entities.TaskStatus) ([]*entities.Task, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []*entities.Task
	for _, task := range m.tasks {
		if task.Status == status {
			result = append(result, task)
		}
	}
	return result, nil
}

func (m *mockTaskRepo) GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Task, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []*entities.Task
	for _, task := range m.tasks {
		if task.AssignedTo == cleanerID {
			result = append(result, task)
		}
	}
	return result, nil
}

func (m *mockTaskRepo) GetByOwner(ctx context.Context, ownerID uuid.UUID) ([]*entities.Task, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []*entities.Task
	for _, task := range m.tasks {
		if task.CreatedBy == ownerID {
			result = append(result, task)
		}
	}
	return result, nil
}

func (m *mockTaskRepo) Update(ctx context.Context, task *entities.Task) error {
	if m.err != nil {
		return m.err
	}
	m.tasks[task.ID] = task
	return nil
}

func (m *mockTaskRepo) Delete(ctx context.Context, id uuid.UUID) error {
	if m.err != nil {
		return m.err
	}
	delete(m.tasks, id)
	return nil
}

func TestListTasksUseCase(t *testing.T) {
	cleanerID := uuid.New()
	ownerID := uuid.New()
	status := entities.TaskStatusPending

	now := time.Now()
	task1, _ := entities.NewTask("Task 1", "Description 1", entities.TaskTypeGeneralCleaning, now, cleanerID, ownerID)
	task2, _ := entities.NewTask("Task 2", "Description 2", entities.TaskTypeBathroomCleaning, now, cleanerID, ownerID)
	task3, _ := entities.NewTask("Task 3", "Description 3", entities.TaskTypeKitchenCleaning, now, uuid.New(), ownerID)

	t.Run("list by cleaner", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task1, task2, task3})

		useCase := usecases.NewListTasksUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.ListTasksInput{CleanerID: &cleanerID})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result.Tasks) != 2 {
			t.Errorf("expected 2 tasks, got %d", len(result.Tasks))
		}
	})

	t.Run("list by owner", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task1, task2, task3})

		useCase := usecases.NewListTasksUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.ListTasksInput{OwnerID: &ownerID})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result.Tasks) != 3 {
			t.Errorf("expected 3 tasks, got %d", len(result.Tasks))
		}
	})

	t.Run("list by status", func(t *testing.T) {
		task1.MarkCompleted()
		task2.MarkInProgress()

		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task1, task2, task3})

		useCase := usecases.NewListTasksUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.ListTasksInput{Status: &status})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result.Tasks) != 1 {
			t.Errorf("expected 1 pending task, got %d", len(result.Tasks))
		}
	})

	t.Run("no filters provided", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task1})

		useCase := usecases.NewListTasksUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.ListTasksInput{})
		if err == nil {
			t.Error("expected error for no filters")
		}
	})

	t.Run("repository error", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.err = errors.New("db error")

		useCase := usecases.NewListTasksUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.ListTasksInput{CleanerID: &cleanerID})
		if err == nil {
			t.Error("expected error")
		}
	})
}

func TestCompleteTaskUseCase(t *testing.T) {
	cleanerID := uuid.New()
	ownerID := uuid.New()
	now := time.Now()
	task, _ := entities.NewTask("Task 1", "Description", entities.TaskTypeGeneralCleaning, now, cleanerID, ownerID)

	t.Run("complete task", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewCompleteTaskUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.CompleteTaskInput{TaskID: task.ID})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.TaskID != task.ID {
			t.Errorf("expected task ID %s, got %s", task.ID, result.TaskID)
		}
		if result.Status != entities.TaskStatusCompleted {
			t.Errorf("expected status completed, got %s", result.Status)
		}
	})

	t.Run("task not found", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{})

		useCase := usecases.NewCompleteTaskUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.CompleteTaskInput{TaskID: uuid.New()})
		if err == nil {
			t.Error("expected error for task not found")
		}
	})

	t.Run("repository error", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.err = errors.New("db error")

		useCase := usecases.NewCompleteTaskUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.CompleteTaskInput{TaskID: task.ID})
		if err == nil {
			t.Error("expected error")
		}
	})
}

func TestUpdateTaskStatusUseCase(t *testing.T) {
	cleanerID := uuid.New()
	ownerID := uuid.New()
	now := time.Now()
	task, _ := entities.NewTask("Task 1", "Description", entities.TaskTypeGeneralCleaning, now, cleanerID, ownerID)

	t.Run("update to in progress", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewUpdateTaskStatusUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.UpdateTaskStatusInput{
			TaskID: task.ID,
			Status: entities.TaskStatusInProgress,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.Status != entities.TaskStatusInProgress {
			t.Errorf("expected status in_progress, got %s", result.Status)
		}
	})

	t.Run("update to pending", func(t *testing.T) {
		task.MarkCompleted()
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewUpdateTaskStatusUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.UpdateTaskStatusInput{
			TaskID: task.ID,
			Status: entities.TaskStatusPending,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.Status != entities.TaskStatusPending {
			t.Errorf("expected status pending, got %s", result.Status)
		}
	})

	t.Run("invalid status", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewUpdateTaskStatusUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.UpdateTaskStatusInput{
			TaskID: task.ID,
			Status: "invalid",
		})
		if err == nil {
			t.Error("expected error for invalid status")
		}
	})

	t.Run("task not found", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{})

		useCase := usecases.NewUpdateTaskStatusUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.UpdateTaskStatusInput{TaskID: uuid.New(), Status: entities.TaskStatusInProgress})
		if err == nil {
			t.Error("expected error for task not found")
		}
	})
}

func TestDeleteTaskUseCase(t *testing.T) {
	cleanerID := uuid.New()
	ownerID := uuid.New()
	now := time.Now()
	task, _ := entities.NewTask("Task 1", "Description", entities.TaskTypeGeneralCleaning, now, cleanerID, ownerID)

	t.Run("delete task", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewDeleteTaskUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.DeleteTaskInput{TaskID: task.ID})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.TaskID != task.ID {
			t.Errorf("expected task ID %s, got %s", task.ID, result.TaskID)
		}
	})

	t.Run("task not found", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.SetTasks([]*entities.Task{})

		useCase := usecases.NewDeleteTaskUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.DeleteTaskInput{TaskID: uuid.New()})
		if err == nil {
			t.Error("expected error for task not found")
		}
	})

	t.Run("repository error", func(t *testing.T) {
		repo := newMockTaskRepo()
		repo.err = errors.New("db error")
		repo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewDeleteTaskUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.DeleteTaskInput{TaskID: task.ID})
		if err == nil {
			t.Error("expected error")
		}
	})
}
