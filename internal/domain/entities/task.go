package entities

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
)

type TaskType string

const (
	TaskTypeGeneralCleaning    TaskType = "general_cleaning"
	TaskTypeBathroomCleaning   TaskType = "bathroom_cleaning"
	TaskTypeKitchenCleaning    TaskType = "kitchen_cleaning"
	TaskTypeFloorCare          TaskType = "floor_care"
	TaskTypeWindowCleaning     TaskType = "window_cleaning"
)

type TaskStatus string

const (
	TaskStatusPending   TaskStatus = "pending"
	TaskStatusInProgress TaskStatus = "in_progress"
	TaskStatusCompleted TaskStatus = "completed"
)

type Task struct {
	ID            uuid.UUID
	Title         string
	Description   string
	TaskType      TaskType
	Status        TaskStatus
 AssignedTo    uuid.UUID
	ScheduledDate time.Time
	ScheduledTime *string
	CreatedBy     uuid.UUID
	CreatedAt     time.Time
	UpdatedAt     time.Time
	CompletedAt   *time.Time
}

func NewTask(title, description string, taskType TaskType, scheduledDate time.Time, assignedTo, createdBy uuid.UUID) (*Task, error) {
	trimmedTitle := strings.TrimSpace(title)
	trimmedDescription := strings.TrimSpace(description)

	if trimmedTitle == "" {
		return nil, errors.New("title is required")
	}
	if len(trimmedTitle) > 100 {
		return nil, errors.New("title must be less than 100 characters")
	}
	if trimmedDescription != "" && len(trimmedDescription) > 500 {
		return nil, errors.New("description must be less than 500 characters")
	}
	if taskType != TaskTypeGeneralCleaning && taskType != TaskTypeBathroomCleaning &&
		taskType != TaskTypeKitchenCleaning && taskType != TaskTypeFloorCare &&
		taskType != TaskTypeWindowCleaning {
		return nil, errors.New("invalid task type")
	}
	if assignedTo == uuid.Nil {
		return nil, errors.New("assignedTo is required")
	}
	if createdBy == uuid.Nil {
		return nil, errors.New("createdBy is required")
	}

	return &Task{
		ID:            uuid.New(),
		Title:         trimmedTitle,
		Description:   trimmedDescription,
		TaskType:      taskType,
		Status:        TaskStatusPending,
		AssignedTo:    assignedTo,
		ScheduledDate: scheduledDate,
		CreatedBy:     createdBy,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}, nil
}

func (t *Task) SetScheduledTime(timeStr string) error {
	if len(timeStr) > 100 {
		return errors.New("time must be less than 100 characters")
	}
	t.ScheduledTime = &timeStr
	t.UpdatedAt = time.Now()
	return nil
}

func (t *Task) SetStatus(status TaskStatus) error {
	if status != TaskStatusPending && status != TaskStatusInProgress && status != TaskStatusCompleted {
		return errors.New("invalid status")
	}
	t.Status = status
	t.UpdatedAt = time.Now()
	if status == TaskStatusCompleted && t.CompletedAt == nil {
		now := time.Now()
		t.CompletedAt = &now
	}
	return nil
}

func (t *Task) MarkInProgress() error {
	return t.SetStatus(TaskStatusInProgress)
}

func (t *Task) MarkCompleted() error {
	return t.SetStatus(TaskStatusCompleted)
}

func (t *Task) MarkPending() error {
	return t.SetStatus(TaskStatusPending)
}
