package domain

import (
	"fmt"

	"github.com/google/uuid"
)

type TaskType string

const (
	TaskTypeGeneral  TaskType = "general"
	TaskTypeBathroom TaskType = "bathroom"
	TaskTypeKitchen  TaskType = "kitchen"
	TaskTypeFloor    TaskType = "floor"
	TaskTypeWindow   TaskType = "window"
)

type TaskStatus string

const (
	TaskPending    TaskStatus = "pending"
	TaskInProgress TaskStatus = "in-progress"
	TaskCompleted  TaskStatus = "completed"
)

type Task struct {
	ID          string
	Title       string
	Description string
	Type        TaskType
	Status      TaskStatus
	ScheduledAt string
	CleanerID   string
	OwnerID     string
}

func (t *Task) GenerateID() {
	t.ID = uuid.New().String()
}

func (t *Task) Validate() error {
	if t.ID == "" {
		return fmt.Errorf("id is required")
	}
	if t.Title == "" {
		return fmt.Errorf("title is required")
	}
	if t.Type != TaskTypeGeneral && t.Type != TaskTypeBathroom && t.Type != TaskTypeKitchen && t.Type != TaskTypeFloor && t.Type != TaskTypeWindow {
		return fmt.Errorf("invalid task type")
	}
	if t.Status != TaskPending && t.Status != TaskInProgress && t.Status != TaskCompleted {
		return fmt.Errorf("invalid task status")
	}
	return nil
}
