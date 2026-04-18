package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type TaskRepository interface {
	Create(ctx context.Context, task *entities.Task) error
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Task, error)
	GetByStatus(ctx context.Context, status entities.TaskStatus) ([]*entities.Task, error)
	GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Task, error)
	GetByOwner(ctx context.Context, ownerID uuid.UUID) ([]*entities.Task, error)
	Update(ctx context.Context, task *entities.Task) error
	Delete(ctx context.Context, id uuid.UUID) error
}
