package entities

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type TimeSlot string

const (
	TimeSlotMorning    TimeSlot = "morning"
	TimeSlotAfternoon  TimeSlot = "afternoon"
	TimeSlotEvening    TimeSlot = "evening"
)

type Schedule struct {
	ID         uuid.UUID
	TaskID     uuid.UUID
	CleanerID  uuid.UUID
	Date       time.Time
	TimeSlot   TimeSlot
	Active     bool
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func NewSchedule(taskID, cleanerID uuid.UUID, date time.Time, timeSlot TimeSlot) (*Schedule, error) {
	if taskID == uuid.Nil {
		return nil, errors.New("taskID is required")
	}
	if cleanerID == uuid.Nil {
		return nil, errors.New("cleanerID is required")
	}
	if timeSlot != TimeSlotMorning && timeSlot != TimeSlotAfternoon && timeSlot != TimeSlotEvening {
		return nil, errors.New("invalid time slot")
	}
	if date.IsZero() {
		return nil, errors.New("date is required")
	}

	return &Schedule{
		ID:        uuid.New(),
		TaskID:    taskID,
		CleanerID: cleanerID,
		Date:      date,
		TimeSlot:  timeSlot,
		Active:    true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (s *Schedule) Deactivate() error {
	s.Active = false
	s.UpdatedAt = time.Now()
	return nil
}

func (s *Schedule) Reactivate() error {
	s.Active = true
	s.UpdatedAt = time.Now()
	return nil
}

func (s *Schedule) UpdateTimeSlot(timeSlot TimeSlot) error {
	if timeSlot != TimeSlotMorning && timeSlot != TimeSlotAfternoon && timeSlot != TimeSlotEvening {
		return errors.New("invalid time slot")
	}
	s.TimeSlot = timeSlot
	s.UpdatedAt = time.Now()
	return nil
}
