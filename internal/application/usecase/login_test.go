package usecase

import (
	"cleanlog/internal/application/mocks"
	"cleanlog/internal/domain"
	"errors"
	"testing"
)

func TestLoginUseCase_Execute_Success(t *testing.T) {
	user := &domain.User{
		Email:    "john@example.com",
		Password: "secret123",
	}

	userRepo := &mocks.MockUserRepository{
		GetByEmailFn: func(email string) (*domain.User, error) {
			return user, nil
		},
	}

	uc := NewLoginUseCase(userRepo)

	result, err := uc.Execute(LoginInput{
		Email:    "john@example.com",
		Password: "secret123",
	})

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Email != "john@example.com" {
		t.Errorf("expected email 'john@example.com', got '%s'", result.Email)
	}
}

func TestLoginUseCase_Execute_InvalidCredentials(t *testing.T) {
	userRepo := &mocks.MockUserRepository{
		GetByEmailFn: func(email string) (*domain.User, error) {
			return nil, errors.New("user not found")
		},
	}

	uc := NewLoginUseCase(userRepo)

	_, err := uc.Execute(LoginInput{
		Email:    "nonexistent@example.com",
		Password: "secret123",
	})

	if err == nil {
		t.Fatal("expected error for invalid credentials")
	}
}

func TestLoginUseCase_Execute_WrongPassword(t *testing.T) {
	user := &domain.User{
		Email:    "john@example.com",
		Password: "correct_password",
	}

	userRepo := &mocks.MockUserRepository{
		GetByEmailFn: func(email string) (*domain.User, error) {
			return user, nil
		},
	}

	uc := NewLoginUseCase(userRepo)

	_, err := uc.Execute(LoginInput{
		Email:    "john@example.com",
		Password: "wrong_password",
	})

	if err == nil {
		t.Fatal("expected error for wrong password")
	}
}
