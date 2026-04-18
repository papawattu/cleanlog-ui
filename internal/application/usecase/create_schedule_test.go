package usecase

import (
	"cleanlog/internal/application/mocks"
	"cleanlog/internal/domain"
	"errors"
	"testing"
)

func TestCreateScheduleUseCase_Execute_Success(t *testing.T) {
	scheduleRepo := &mocks.MockScheduleRepository{
		CreateFn: func(schedule *domain.Schedule) error {
			schedule.ID = "sched-1"
			return nil
		},
	}

	uc := NewCreateScheduleUseCase(scheduleRepo)

	schedule, err := uc.Execute(CreateScheduleInput{
		TaskID: "task-1",
		Date:   "2024-04-20",
	})

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if schedule.TaskID != "task-1" {
		t.Errorf("expected task_id 'task-1', got '%s'", schedule.TaskID)
	}

	if schedule.Date != "2024-04-20" {
		t.Errorf("expected date '2024-04-20', got '%s'", schedule.Date)
	}
}

func TestCreateScheduleUseCase_Execute_EmptyTaskID(t *testing.T) {
	scheduleRepo := &mocks.MockScheduleRepository{
		CreateFn: func(schedule *domain.Schedule) error {
			return nil
		},
	}

	uc := NewCreateScheduleUseCase(scheduleRepo)

	_, err := uc.Execute(CreateScheduleInput{
		TaskID: "",
		Date:   "2024-04-20",
	})

	if err == nil {
		t.Fatal("expected error for empty task id")
	}
}

func TestCreateScheduleUseCase_Execute_EmptyDate(t *testing.T) {
	scheduleRepo := &mocks.MockScheduleRepository{
		CreateFn: func(schedule *domain.Schedule) error {
			return nil
		},
	}

	uc := NewCreateScheduleUseCase(scheduleRepo)

	_, err := uc.Execute(CreateScheduleInput{
		TaskID: "task-1",
		Date:   "",
	})

	if err == nil {
		t.Fatal("expected error for empty date")
	}
}

func TestCreateScheduleUseCase_Execute_DatabaseError(t *testing.T) {
	dbErr := errors.New("database error")
	scheduleRepo := &mocks.MockScheduleRepository{
		CreateFn: func(schedule *domain.Schedule) error {
			return dbErr
		},
	}

	uc := NewCreateScheduleUseCase(scheduleRepo)

	_, err := uc.Execute(CreateScheduleInput{
		TaskID: "task-1",
		Date:   "2024-04-20",
	})

	if err == nil {
		t.Fatal("expected database error")
	}
}
