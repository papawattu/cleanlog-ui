package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	output "cleanlog/internal/application/ports/output"
	"cleanlog/internal/domain/entities"
)

type RegisterUserUseCase struct {
	userRepo output.UserRepository
}

func NewRegisterUserUseCase(userRepo output.UserRepository) input.RegisterUseCase {
	return &RegisterUserUseCase{
		userRepo: userRepo,
	}
}

func (uc *RegisterUserUseCase) Execute(ctx context.Context, req input.RegisterUserInput) (*input.RegisterUserOutput, error) {
	if req.Email == "" {
		return nil, fmt.Errorf("email is required")
	}
	if req.Password == "" {
		return nil, fmt.Errorf("password is required")
	}
	if req.FullName == "" {
		return nil, fmt.Errorf("full name is required")
	}
	if req.Role != entities.UserRoleCleaner && req.Role != entities.UserRoleOwner {
		return nil, fmt.Errorf("invalid role")
	}

	existingUser, err := uc.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing user: %w", err)
	}
	if existingUser != nil {
		return nil, fmt.Errorf("user with this email already exists")
	}

	user, err := entities.NewUser(req.Email, req.Password, req.FullName, req.Role)
	if err != nil {
		return nil, fmt.Errorf("invalid user input: %w", err)
	}

	if err := uc.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &input.RegisterUserOutput{
		ID:       user.ID,
		Email:    user.Email,
		Role:     user.Role,
		FullName: user.FullName,
	}, nil
}
