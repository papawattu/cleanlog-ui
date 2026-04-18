package mocks

import "cleanlog/internal/domain"

type MockUserRepository struct {
	CreateFn     func(user *domain.User) error
	GetByIDFn    func(id string) (*domain.User, error)
	GetByEmailFn func(email string) (*domain.User, error)
	UpdateFn     func(user *domain.User) error
	DeleteFn     func(id string) error
	ListFn       func() ([]*domain.User, error)
}

func (m *MockUserRepository) Create(user *domain.User) error {
	return m.CreateFn(user)
}

func (m *MockUserRepository) GetByID(id string) (*domain.User, error) {
	return m.GetByIDFn(id)
}

func (m *MockUserRepository) GetByEmail(email string) (*domain.User, error) {
	return m.GetByEmailFn(email)
}

func (m *MockUserRepository) Update(user *domain.User) error {
	return m.UpdateFn(user)
}

func (m *MockUserRepository) Delete(id string) error {
	return m.DeleteFn(id)
}

func (m *MockUserRepository) List() ([]*domain.User, error) {
	return m.ListFn()
}
