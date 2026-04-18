package domain

import (
	"fmt"

	"github.com/google/uuid"
)

type Schedule struct {
	ID     string
	TaskID string
	Date   string
}

func (s *Schedule) GenerateID() {
	s.ID = uuid.New().String()
}

func (s *Schedule) Validate() error {
	if s.ID == "" {
		return fmt.Errorf("id is required")
	}
	if s.TaskID == "" {
		return fmt.Errorf("task id is required")
	}
	if s.Date == "" {
		return fmt.Errorf("date is required")
	}
	return nil
}
