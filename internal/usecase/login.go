package usecases

import (
	"context"
	"fmt"

	input "cleanlog/internal/application/ports/input"
	"golang.org/x/crypto/bcrypt"
	output "cleanlog/internal/application/ports/output"
)

type LoginUseCase struct {
	userRepo    output.UserRepository
	tokenService output.TokenService
}

func NewLoginUseCase(userRepo output.UserRepository, tokenService output.TokenService) input.LoginUseCase {
	return &LoginUseCase{
		userRepo:    userRepo,
		tokenService: tokenService,
	}
}

func (uc *LoginUseCase) Execute(ctx context.Context, req input.LoginInput) (*input.LoginOutput, error) {
	if req.Email == "" {
		return nil, fmt.Errorf("email is required")
	}
	if req.Password == "" {
		return nil, fmt.Errorf("password is required")
	}

	user, err := uc.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}
	if user == nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	token, err := uc.tokenService.GenerateToken(user.ID.String(), user.Email, user.Role, user.FullName)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &input.LoginOutput{
		ID:       user.ID,
		Email:    user.Email,
		Role:     user.Role,
		FullName: user.FullName,
		Token:    token,
	}, nil
}
