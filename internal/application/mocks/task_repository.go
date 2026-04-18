package mocks

import "cleanlog/internal/domain"

type MockTaskRepository struct {
	CreateFn          func(task *domain.Task) error
	GetByIDFn         func(id string) (*domain.Task, error)
	UpdateFn          func(task *domain.Task) error
	DeleteFn          func(id string) error
	ListFn            func() ([]*domain.Task, error)
	FindByCleanerIDFn func(cleanerID string) ([]*domain.Task, error)
	FindByOwnerIDFn   func(ownerID string) ([]*domain.Task, error)
}

func (m *MockTaskRepository) Create(task *domain.Task) error {
	return m.CreateFn(task)
}

func (m *MockTaskRepository) GetByID(id string) (*domain.Task, error) {
	return m.GetByIDFn(id)
}

func (m *MockTaskRepository) Update(task *domain.Task) error {
	return m.UpdateFn(task)
}

func (m *MockTaskRepository) Delete(id string) error {
	return m.DeleteFn(id)
}

func (m *MockTaskRepository) List() ([]*domain.Task, error) {
	return m.ListFn()
}

func (m *MockTaskRepository) FindByCleanerID(cleanerID string) ([]*domain.Task, error) {
	return m.FindByCleanerIDFn(cleanerID)
}

func (m *MockTaskRepository) FindByOwnerID(ownerID string) ([]*domain.Task, error) {
	return m.FindByOwnerIDFn(ownerID)
}
