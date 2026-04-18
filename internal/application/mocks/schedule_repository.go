package mocks

import "cleanlog/internal/domain"

type MockScheduleRepository struct {
	CreateFn       func(schedule *domain.Schedule) error
	GetByIDFn      func(id string) (*domain.Schedule, error)
	UpdateFn       func(schedule *domain.Schedule) error
	DeleteFn       func(id string) error
	ListFn         func() ([]*domain.Schedule, error)
	FindByTaskIDFn func(taskID string) ([]*domain.Schedule, error)
}

func (m *MockScheduleRepository) Create(schedule *domain.Schedule) error {
	return m.CreateFn(schedule)
}

func (m *MockScheduleRepository) GetByID(id string) (*domain.Schedule, error) {
	return m.GetByIDFn(id)
}

func (m *MockScheduleRepository) Update(schedule *domain.Schedule) error {
	return m.UpdateFn(schedule)
}

func (m *MockScheduleRepository) Delete(id string) error {
	return m.DeleteFn(id)
}

func (m *MockScheduleRepository) List() ([]*domain.Schedule, error) {
	return m.ListFn()
}

func (m *MockScheduleRepository) FindByTaskID(taskID string) ([]*domain.Schedule, error) {
	return m.FindByTaskIDFn(taskID)
}
