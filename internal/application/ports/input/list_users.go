package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
)

type ListUsersInput struct {
	Role *entities.UserRole
}

type ListUsersOutput struct {
	Users []*entities.User
}

type ListUsersUseCase interface {
	Execute(ctx context.Context, input ListUsersInput) (*ListUsersOutput, error)
}
