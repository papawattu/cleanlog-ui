package entities

import (
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
)

func TestNewTask(t *testing.T) {
	now := time.Now()
	cleanerID := uuid.New()
	ownerID := uuid.New()

	tests := []struct {
		name       string
		title      string
		description string
		taskType   TaskType
		scheduledDate time.Time
		assignedTo uuid.UUID
		createdBy uuid.UUID
		wantErr    bool
		errMessage string
	}{
		{
			name:       "valid task",
			title:      "Clean living room",
			description: "Vacuum and mop",
			taskType:   TaskTypeGeneralCleaning,
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: cleanerID,
			createdBy: ownerID,
			wantErr:    false,
			errMessage: "",
		},
		{
			name:       "empty title",
			title:      "",
			description: "",
			taskType:   TaskTypeGeneralCleaning,
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: cleanerID,
			createdBy: ownerID,
			wantErr:    true,
			errMessage: "title is required",
		},
		{
			name:       "title too long",
			title:      strings.Repeat("x", 101),
			description: "",
			taskType:   TaskTypeGeneralCleaning,
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: cleanerID,
			createdBy: ownerID,
			wantErr:    true,
			errMessage: "title must be less than 100 characters",
		},
		{
			name:       "description too long",
			title:      "Test task",
			description: strings.Repeat("x", 501),
			taskType:   TaskTypeGeneralCleaning,
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: cleanerID,
			createdBy: ownerID,
			wantErr:    true,
			errMessage: "description must be less than 500 characters",
		},
		{
			name:       "invalid task type",
			title:      "Test task",
			description: "",
			taskType:   TaskType("invalid"),
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: cleanerID,
			createdBy: ownerID,
			wantErr:    true,
			errMessage: "invalid task type",
		},
		{
			name:       "nil assignedTo",
			title:      "Test task",
			description: "",
			taskType:   TaskTypeGeneralCleaning,
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: uuid.Nil,
			createdBy: ownerID,
			wantErr:    true,
			errMessage: "assignedTo is required",
		},
		{
			name:       "nil createdBy",
			title:      "Test task",
			description: "",
			taskType:   TaskTypeGeneralCleaning,
			scheduledDate: now.Add(24 * time.Hour),
			assignedTo: cleanerID,
			createdBy: uuid.Nil,
			wantErr:    true,
			errMessage: "createdBy is required",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			task, err := NewTask(tt.title, tt.description, tt.taskType, tt.scheduledDate, tt.assignedTo, tt.createdBy)

			if tt.wantErr {
				if err == nil {
					t.Errorf("expected error, got nil")
					return
				}
				if err.Error() != tt.errMessage {
					t.Errorf("expected error %q, got %q", tt.errMessage, err.Error())
				}
				return
			}

			if err != nil {
				t.Errorf("expected no error, got %v", err)
				return
			}

			if task.ID == uuid.Nil {
				t.Error("expected non-nil UUID")
			}
			if task.Status != TaskStatusPending {
				t.Errorf("expected status pending, got %q", task.Status)
			}
			if task.CompletedAt != nil {
				t.Error("expected completedAt to be nil initially")
			}
		})
	}
}

func TestTaskSetScheduledTime(t *testing.T) {
	task, _ := NewTask("Clean living room", "", TaskTypeGeneralCleaning, time.Now().Add(24*time.Hour), uuid.New(), uuid.New())

	err := task.SetScheduledTime("10:00")
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if task.ScheduledTime == nil {
		t.Error("expected ScheduledTime to be set")
	}
	if *task.ScheduledTime != "10:00" {
		t.Errorf("expected 10:00, got %q", *task.ScheduledTime)
	}

	err = task.SetScheduledTime(strings.Repeat("x", 101))
	if err == nil {
		t.Error("expected error for too long time")
	}
}

func TestTaskSetStatus(t *testing.T) {
	task, _ := NewTask("Test", "", TaskTypeGeneralCleaning, time.Now().Add(24*time.Hour), uuid.New(), uuid.New())

	// Test in-progress
	err := task.MarkInProgress()
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if task.Status != TaskStatusInProgress {
		t.Errorf("expected in_progress, got %q", task.Status)
	}
	if task.CompletedAt != nil {
		t.Error("expected completedAt to be nil for in_progress")
	}

	// Test completed
	err = task.MarkCompleted()
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if task.Status != TaskStatusCompleted {
		t.Errorf("expected completed, got %q", task.Status)
	}
	if task.CompletedAt == nil {
		t.Error("expected completedAt to be set")
	}

	// Test invalid status
	task.Status = TaskStatusPending
	err = task.SetStatus(TaskStatus("invalid"))
	if err == nil {
		t.Error("expected error for invalid status")
	}
}

func TestTaskMarkPending(t *testing.T) {
	task, _ := NewTask("Test", "", TaskTypeGeneralCleaning, time.Now().Add(24*time.Hour), uuid.New(), uuid.New())

	err := task.MarkCompleted()
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	err = task.MarkPending()
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if task.Status != TaskStatusPending {
		t.Errorf("expected pending, got %q", task.Status)
	}
	// CompletedAt should remain set
	if task.CompletedAt == nil {
		t.Error("expected completedAt to remain set")
	}
}
