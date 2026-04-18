package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
)

type ListUsersUseCase struct {
	userRepo output.UserRepository
}

func NewListUsersUseCase(userRepo output.UserRepository) input.ListUsersUseCase {
	return &ListUsersUseCase{
		userRepo: userRepo,
	}
}

func (uc *ListUsersUseCase) Execute(ctx context.Context, req input.ListUsersInput) (*input.ListUsersOutput, error) {
	users, err := uc.userRepo.List(ctx, req.Role)
	if err != nil {
		return nil, fmt.Errorf("failed to list users: %w", err)
	}

	return &input.ListUsersOutput{
		Users: users,
	}, nil
}
