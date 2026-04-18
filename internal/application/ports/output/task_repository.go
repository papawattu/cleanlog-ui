package ports

import "cleanlog/internal/domain"

type TaskRepository interface {
	Create(task *domain.Task) error
	GetByID(id string) (*domain.Task, error)
	Update(task *domain.Task) error
	Delete(id string) error
	List() ([]*domain.Task, error)
	FindByCleanerID(cleanerID string) ([]*domain.Task, error)
	FindByOwnerID(ownerID string) ([]*domain.Task, error)
}
