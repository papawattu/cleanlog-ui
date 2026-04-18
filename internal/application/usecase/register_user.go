package usecase

import "cleanlog/internal/domain"

type RegisterUserInput struct {
	Name     string
	Email    string
	Password string
	Role     domain.Role
}

type RegisterUserUseCase struct {
	userRepo domain.UserRepository
}

func NewRegisterUserUseCase(userRepo domain.UserRepository) *RegisterUserUseCase {
	return &RegisterUserUseCase{userRepo: userRepo}
}

func (uc *RegisterUserUseCase) Execute(input RegisterUserInput) (*domain.User, error) {
	user := &domain.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
		Role:     input.Role,
	}

	user.GenerateID()

	if err := user.Validate(); err != nil {
		return nil, err
	}

	if err := uc.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}
