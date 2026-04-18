package entities

import (
	"testing"
	"time"

	"github.com/google/uuid"
)

func TestNewSchedule(t *testing.T) {
	now := time.Now()
	futureDate := now.Add(24 * time.Hour)

	tests := []struct {
		name       string
		taskID     uuid.UUID
		cleanerID  uuid.UUID
		date       time.Time
		timeSlot   TimeSlot
		wantErr    bool
		errMessage string
	}{
		{
			name:       "valid schedule",
			taskID:     uuid.New(),
			cleanerID:  uuid.New(),
			date:       futureDate,
			timeSlot:   TimeSlotMorning,
			wantErr:    false,
			errMessage: "",
		},
		{
			name:       "nil taskID",
			taskID:     uuid.Nil,
			cleanerID:  uuid.New(),
			date:       futureDate,
			timeSlot:   TimeSlotMorning,
			wantErr:    true,
			errMessage: "taskID is required",
		},
		{
			name:       "nil cleanerID",
			taskID:     uuid.New(),
			cleanerID:  uuid.Nil,
			date:       futureDate,
			timeSlot:   TimeSlotMorning,
			wantErr:    true,
			errMessage: "cleanerID is required",
		},
		{
			name:       "invalid time slot",
			taskID:     uuid.New(),
			cleanerID:  uuid.New(),
			date:       futureDate,
			timeSlot:   TimeSlot("invalid"),
			wantErr:    true,
			errMessage: "invalid time slot",
		},
		{
			name:       "zero date",
			taskID:     uuid.New(),
			cleanerID:  uuid.New(),
			date:       time.Time{},
			timeSlot:   TimeSlotMorning,
			wantErr:    true,
			errMessage: "date is required",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			schedule, err := NewSchedule(tt.taskID, tt.cleanerID, tt.date, tt.timeSlot)

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

			if schedule.ID == uuid.Nil {
				t.Error("expected non-nil UUID")
			}
			if schedule.Active != true {
				t.Error("expected schedule to be active by default")
			}
		})
	}
}

func TestScheduleDeactivate(t *testing.T) {
	schedule, _ := NewSchedule(uuid.New(), uuid.New(), time.Now().Add(24*time.Hour), TimeSlotMorning)

	if !schedule.Active {
		t.Error("expected schedule to be active initially")
	}

	err := schedule.Deactivate()
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if schedule.Active {
		t.Error("expected schedule to be inactive")
	}
}

func TestScheduleUpdateTimeSlot(t *testing.T) {
	schedule, _ := NewSchedule(uuid.New(), uuid.New(), time.Now().Add(24*time.Hour), TimeSlotMorning)

	err := schedule.UpdateTimeSlot(TimeSlotAfternoon)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if schedule.TimeSlot != TimeSlotAfternoon {
		t.Errorf("expected TimeSlotAfternoon, got %q", schedule.TimeSlot)
	}

	oldTime := schedule.UpdatedAt
	time.Sleep(100 * time.Millisecond)

	err = schedule.UpdateTimeSlot(TimeSlotEvening)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if schedule.TimeSlot != TimeSlotEvening {
		t.Errorf("expected TimeSlotEvening, got %q", schedule.TimeSlot)
	}
	if schedule.UpdatedAt.Before(oldTime) {
		t.Error("expected UpdatedAt to be updated")
	}

	err = schedule.UpdateTimeSlot(TimeSlot("invalid"))
	if err == nil {
		t.Error("expected error for invalid time slot")
	}
}
