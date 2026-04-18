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

type mockScheduleRepo struct {
	schedules map[uuid.UUID]*entities.Schedule
	err       error
}

func newMockScheduleRepo() *mockScheduleRepo {
	return &mockScheduleRepo{
		schedules: make(map[uuid.UUID]*entities.Schedule),
	}
}

func (m *mockScheduleRepo) Create(ctx context.Context, schedule *entities.Schedule) error {
	if m.err != nil {
		return m.err
	}
	m.schedules[schedule.ID] = schedule
	return nil
}

func (m *mockScheduleRepo) GetByID(ctx context.Context, id uuid.UUID) (*entities.Schedule, error) {
	if m.err != nil {
		return nil, m.err
	}
	schedule, ok := m.schedules[id]
	if !ok {
		return nil, nil
	}
	return schedule, nil
}

func (m *mockScheduleRepo) GetByTask(ctx context.Context, taskID uuid.UUID) ([]*entities.Schedule, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []*entities.Schedule
	for _, s := range m.schedules {
		if s.TaskID == taskID {
			result = append(result, s)
		}
	}
	return result, nil
}

func (m *mockScheduleRepo) GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Schedule, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []*entities.Schedule
	for _, s := range m.schedules {
		if s.CleanerID == cleanerID {
			result = append(result, s)
		}
	}
	return result, nil
}

func (m *mockScheduleRepo) Update(ctx context.Context, schedule *entities.Schedule) error {
	if m.err != nil {
		return m.err
	}
	m.schedules[schedule.ID] = schedule
	return nil
}

func (m *mockScheduleRepo) Delete(ctx context.Context, id uuid.UUID) error {
	if m.err != nil {
		return m.err
	}
	delete(m.schedules, id)
	return nil
}

func (m *mockScheduleRepo) ListActive(ctx context.Context) ([]*entities.Schedule, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []*entities.Schedule
	for _, s := range m.schedules {
		if s.Active {
			result = append(result, s)
		}
	}
	return result, nil
}

func (m *mockScheduleRepo) SetSchedules(schedules []*entities.Schedule) {
	m.schedules = make(map[uuid.UUID]*entities.Schedule)
	for _, s := range schedules {
		m.schedules[s.ID] = s
	}
}

type mockTaskRepoForSchedule struct {
	tasks map[uuid.UUID]*entities.Task
	err   error
}

func newMockTaskRepoForSchedule() *mockTaskRepoForSchedule {
	return &mockTaskRepoForSchedule{
		tasks: make(map[uuid.UUID]*entities.Task),
	}
}

func (m *mockTaskRepoForSchedule) Create(ctx context.Context, task *entities.Task) error {
	return m.err
}

func (m *mockTaskRepoForSchedule) GetByID(ctx context.Context, id uuid.UUID) (*entities.Task, error) {
	if m.err != nil {
		return nil, m.err
	}
	task, ok := m.tasks[id]
	if !ok {
		return nil, nil
	}
	return task, nil
}

func (m *mockTaskRepoForSchedule) GetByStatus(ctx context.Context, status entities.TaskStatus) ([]*entities.Task, error) {
	return nil, nil
}

func (m *mockTaskRepoForSchedule) GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Task, error) {
	return nil, nil
}

func (m *mockTaskRepoForSchedule) GetByOwner(ctx context.Context, ownerID uuid.UUID) ([]*entities.Task, error) {
	return nil, nil
}

func (m *mockTaskRepoForSchedule) Update(ctx context.Context, task *entities.Task) error {
	if m.err != nil {
		return m.err
	}
	m.tasks[task.ID] = task
	return nil
}

func (m *mockTaskRepoForSchedule) Delete(ctx context.Context, id uuid.UUID) error {
	if m.err != nil {
		return m.err
	}
	delete(m.tasks, id)
	return nil
}

func (m *mockTaskRepoForSchedule) SetTasks(tasks []*entities.Task) {
	m.tasks = make(map[uuid.UUID]*entities.Task)
	for _, t := range tasks {
		m.tasks[t.ID] = t
	}
}

func TestCreateScheduleUseCase(t *testing.T) {
	taskID := uuid.New()
	cleanerID := uuid.New()
	task, _ := entities.NewTask("Clean Kitchen", "Deep clean kitchen", entities.TaskTypeKitchenCleaning, time.Now(), cleanerID, uuid.New())

	t.Run("create schedule success", func(t *testing.T) {
		scheduleRepo := newMockScheduleRepo()
		taskRepo := newMockTaskRepoForSchedule()
		taskRepo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewCreateScheduleUseCase(scheduleRepo, taskRepo)
		result, err := useCase.Execute(context.Background(), input.CreateScheduleInput{
			TaskID:    task.ID,
			CleanerID: cleanerID,
			Date:      "2025-06-15",
			TimeSlot:  entities.TimeSlotMorning,
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.ID == uuid.Nil {
			t.Error("expected non-nil ID")
		}
	})

	t.Run("task not found", func(t *testing.T) {
		scheduleRepo := newMockScheduleRepo()
		taskRepo := newMockTaskRepoForSchedule()
		taskRepo.SetTasks([]*entities.Task{})

		useCase := usecases.NewCreateScheduleUseCase(scheduleRepo, taskRepo)
		_, err := useCase.Execute(context.Background(), input.CreateScheduleInput{
			TaskID:    uuid.New(),
			CleanerID: cleanerID,
			Date:      "2025-06-15",
			TimeSlot:  entities.TimeSlotMorning,
		})
		if err == nil {
			t.Error("expected error for task not found")
		}
	})

	t.Run("invalid date format", func(t *testing.T) {
		scheduleRepo := newMockScheduleRepo()
		taskRepo := newMockTaskRepoForSchedule()
		taskRepo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewCreateScheduleUseCase(scheduleRepo, taskRepo)
		_, err := useCase.Execute(context.Background(), input.CreateScheduleInput{
			TaskID:    taskID,
			CleanerID: cleanerID,
			Date:      "not-a-date",
			TimeSlot:  entities.TimeSlotMorning,
		})
		if err == nil {
			t.Error("expected error for invalid date")
		}
	})

	t.Run("invalid time slot", func(t *testing.T) {
		scheduleRepo := newMockScheduleRepo()
		taskRepo := newMockTaskRepoForSchedule()
		taskRepo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewCreateScheduleUseCase(scheduleRepo, taskRepo)
		_, err := useCase.Execute(context.Background(), input.CreateScheduleInput{
			TaskID:    taskID,
			CleanerID: cleanerID,
			Date:      "2025-06-15",
			TimeSlot:  "invalid",
		})
		if err == nil {
			t.Error("expected error for invalid time slot")
		}
	})

	t.Run("repository error", func(t *testing.T) {
		scheduleRepo := newMockScheduleRepo()
		scheduleRepo.err = errors.New("db error")
		taskRepo := newMockTaskRepoForSchedule()
		taskRepo.SetTasks([]*entities.Task{task})

		useCase := usecases.NewCreateScheduleUseCase(scheduleRepo, taskRepo)
		_, err := useCase.Execute(context.Background(), input.CreateScheduleInput{
			TaskID:    taskID,
			CleanerID: cleanerID,
			Date:      "2025-06-15",
			TimeSlot:  entities.TimeSlotMorning,
		})
		if err == nil {
			t.Error("expected error")
		}
	})
}

func TestListSchedulesUseCase(t *testing.T) {
	cleanerID := uuid.New()
	taskID := uuid.New()
	now := time.Now()
	schedule1, _ := entities.NewSchedule(taskID, cleanerID, now, entities.TimeSlotMorning)
	schedule2, _ := entities.NewSchedule(taskID, cleanerID, now.AddDate(0, 0, 1), entities.TimeSlotAfternoon)
	schedule3, _ := entities.NewSchedule(uuid.New(), uuid.New(), now, entities.TimeSlotEvening)

	t.Run("list by cleaner", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule1, schedule2, schedule3})

		useCase := usecases.NewListSchedulesUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.ListSchedulesInput{CleanerID: &cleanerID})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result.Schedules) != 2 {
			t.Errorf("expected 2 schedules, got %d", len(result.Schedules))
		}
	})

	t.Run("list by task", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule1, schedule2, schedule3})

		useCase := usecases.NewListSchedulesUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.ListSchedulesInput{TaskID: &taskID})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result.Schedules) != 2 {
			t.Errorf("expected 2 schedules, got %d", len(result.Schedules))
		}
	})

	t.Run("list active schedules", func(t *testing.T) {
		schedule1.Deactivate()
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule1, schedule2, schedule3})

		useCase := usecases.NewListSchedulesUseCase(repo)
		active := true
		result, err := useCase.Execute(context.Background(), input.ListSchedulesInput{Active: &active})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result.Schedules) != 2 {
			t.Errorf("expected 2 active schedules, got %d", len(result.Schedules))
		}
	})

	t.Run("no filters provided", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule1})

		useCase := usecases.NewListSchedulesUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.ListSchedulesInput{})
		if err == nil {
			t.Error("expected error for no filters")
		}
	})

	t.Run("repository error", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.err = errors.New("db error")

		useCase := usecases.NewListSchedulesUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.ListSchedulesInput{CleanerID: &cleanerID})
		if err == nil {
			t.Error("expected error")
		}
	})
}

func TestUpdateScheduleUseCase(t *testing.T) {
	cleanerID := uuid.New()
	taskID := uuid.New()
	now := time.Now()
	schedule, _ := entities.NewSchedule(taskID, cleanerID, now, entities.TimeSlotMorning)

	t.Run("update time slot", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule})

		useCase := usecases.NewUpdateScheduleUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.UpdateScheduleInput{
			ID:       schedule.ID,
			TimeSlot: timeSlotPtr(entities.TimeSlotAfternoon),
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.TimeSlot != entities.TimeSlotAfternoon {
			t.Errorf("expected afternoon, got %s", result.TimeSlot)
		}
	})

	t.Run("deactivate schedule", func(t *testing.T) {
		schedule2, _ := entities.NewSchedule(taskID, cleanerID, now.AddDate(0, 0, 1), entities.TimeSlotMorning)
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule2})

		useCase := usecases.NewUpdateScheduleUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.UpdateScheduleInput{
			ID:     schedule2.ID,
			Active: boolPtr(false),
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.Active {
			t.Error("expected inactive schedule")
		}
	})

	t.Run("reactivate schedule", func(t *testing.T) {
		schedule.Deactivate()
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule})

		useCase := usecases.NewUpdateScheduleUseCase(repo)
		result, err := useCase.Execute(context.Background(), input.UpdateScheduleInput{
			ID:     schedule.ID,
			Active: boolPtr(true),
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !result.Active {
			t.Error("expected active schedule")
		}
	})

	t.Run("invalid time slot", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{schedule})

		useCase := usecases.NewUpdateScheduleUseCase(repo)
		invalidSlot := entities.TimeSlot("invalid")
		_, err := useCase.Execute(context.Background(), input.UpdateScheduleInput{
			ID:       schedule.ID,
			TimeSlot: &invalidSlot,
		})
		if err == nil {
			t.Error("expected error for invalid time slot")
		}
	})

	t.Run("schedule not found", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.SetSchedules([]*entities.Schedule{})

		useCase := usecases.NewUpdateScheduleUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.UpdateScheduleInput{ID: uuid.New()})
		if err == nil {
			t.Error("expected error for schedule not found")
		}
	})

	t.Run("repository error", func(t *testing.T) {
		repo := newMockScheduleRepo()
		repo.err = errors.New("db error")
		repo.SetSchedules([]*entities.Schedule{schedule})

		useCase := usecases.NewUpdateScheduleUseCase(repo)
		_, err := useCase.Execute(context.Background(), input.UpdateScheduleInput{
			ID:       schedule.ID,
			TimeSlot: timeSlotPtr(entities.TimeSlotAfternoon),
		})
		if err == nil {
			t.Error("expected error")
		}
	})
}

func timeSlotPtr(s entities.TimeSlot) *entities.TimeSlot {
	return &s
}

func boolPtr(b bool) *bool {
	return &b
}
