package domain

import "fmt"

type Schedule struct {
	ID     string
	TaskID string
	Date   string
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
