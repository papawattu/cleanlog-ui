package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type ScheduleRepository interface {
	Create(ctx context.Context, schedule *entities.Schedule) error
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Schedule, error)
	GetByTask(ctx context.Context, taskID uuid.UUID) ([]*entities.Schedule, error)
	GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Schedule, error)
	Update(ctx context.Context, schedule *entities.Schedule) error
	Delete(ctx context.Context, id uuid.UUID) error
	ListActive(ctx context.Context) ([]*entities.Schedule, error)
}
