package ports

import "cleanlog/internal/domain"

type ScheduleRepository interface {
	Create(schedule *domain.Schedule) error
	GetByID(id string) (*domain.Schedule, error)
	Update(schedule *domain.Schedule) error
	Delete(id string) error
	List() ([]*domain.Schedule, error)
	FindByTaskID(taskID string) ([]*domain.Schedule, error)
}
