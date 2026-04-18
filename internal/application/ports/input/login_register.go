package ports

import (
	"context"

	"cleanlog/internal/domain/entities"
	"github.com/google/uuid"
)

type RegisterUserInput struct {
	Email    string
	Password string
	FullName string
	Role     entities.UserRole
}

type RegisterUserOutput struct {
	ID       uuid.UUID
	Email    string
	Role     entities.UserRole
	FullName string
}

type UseCaseResult struct {
	Data interface{}
	Err  error
}

type RegisterUseCase interface {
	Execute(ctx context.Context, input RegisterUserInput) (*RegisterUserOutput, error)
}
