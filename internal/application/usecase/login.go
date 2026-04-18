package usecase

import (
	"cleanlog/internal/domain"
	"fmt"
)

type LoginInput struct {
	Email    string
	Password string
}

type LoginUseCase struct {
	userRepo domain.UserRepository
}

func NewLoginUseCase(userRepo domain.UserRepository) *LoginUseCase {
	return &LoginUseCase{userRepo: userRepo}
}

func (uc *LoginUseCase) Execute(input LoginInput) (*domain.User, error) {
	user, err := uc.userRepo.GetByEmail(input.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	if user.Password != input.Password {
		return nil, fmt.Errorf("invalid credentials")
	}

	return user, nil
}
