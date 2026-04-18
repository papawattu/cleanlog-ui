package usecase

import (
	"cleanlog/internal/application/mocks"
	"cleanlog/internal/domain"
	"errors"
	"testing"
)

func TestRegisterUserUseCase_Execute(t *testing.T) {
	userRepo := &mocks.MockUserRepository{
		CreateFn: func(user *domain.User) error {
			return nil
		},
	}

	uc := NewRegisterUserUseCase(userRepo)

	user, err := uc.Execute(RegisterUserInput{
		Name:     "John Doe",
		Email:    "john@example.com",
		Password: "secret123",
		Role:     domain.RoleCleaner,
	})

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if user.Name != "John Doe" {
		t.Errorf("expected name 'John Doe', got '%s'", user.Name)
	}

	if user.Role != domain.RoleCleaner {
		t.Errorf("expected role 'cleaner', got '%s'", user.Role)
	}
}

func TestRegisterUserUseCase_Execute_InvalidRole(t *testing.T) {
	userRepo := &mocks.MockUserRepository{
		CreateFn: func(user *domain.User) error {
			return nil
		},
	}

	uc := NewRegisterUserUseCase(userRepo)

	_, err := uc.Execute(RegisterUserInput{
		Name:     "John Doe",
		Email:    "john@example.com",
		Password: "secret123",
		Role:     "invalid",
	})

	if err == nil {
		t.Fatal("expected error for invalid role")
	}
}

func TestRegisterUserUseCase_Execute_EmptyName(t *testing.T) {
	userRepo := &mocks.MockUserRepository{
		CreateFn: func(user *domain.User) error {
			return nil
		},
	}

	uc := NewRegisterUserUseCase(userRepo)

	_, err := uc.Execute(RegisterUserInput{
		Name:     "",
		Email:    "john@example.com",
		Password: "secret123",
		Role:     domain.RoleCleaner,
	})

	if err == nil {
		t.Fatal("expected error for empty name")
	}
}

func TestRegisterUserUseCase_Execute_DatabaseError(t *testing.T) {
	dbErr := errors.New("database error")
	userRepo := &mocks.MockUserRepository{
		CreateFn: func(user *domain.User) error {
			return dbErr
		},
	}

	uc := NewRegisterUserUseCase(userRepo)

	_, err := uc.Execute(RegisterUserInput{
		Name:     "John Doe",
		Email:    "john@example.com",
		Password: "secret123",
		Role:     domain.RoleCleaner,
	})

	if err == nil {
		t.Fatal("expected error for database failure")
	}
}
