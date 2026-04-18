package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type LoginInput struct {
	Email    string
	Password string
}

type LoginOutput struct {
	ID       uuid.UUID
	Email    string
	Role     entities.UserRole
	FullName string
	Token    string
}

type LoginUseCase interface {
	Execute(ctx context.Context, input LoginInput) (*LoginOutput, error)
}
