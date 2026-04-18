package usecases_test

import (
	"context"
	"database/sql"
	"errors"
	"os"
	"testing"

	input "cleanlog/internal/application/ports/input"
	"cleanlog/internal/domain/entities"
	"cleanlog/internal/infrastructure/persistence/sqlite"
	"cleanlog/internal/usecase"
	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

type mockTokenService struct{}

func (m *mockTokenService) GenerateToken(userID, email string, role entities.UserRole, fullName string) (string, error) {
	return "mock-token-" + userID, nil
}

func (m *mockTokenService) ParseAndValidate(tokenString string) (*entities.UserClaims, error) {
	return nil, errors.New("not implemented")
}

func setupTestDB(t *testing.T) *sql.DB {
	tmpFile, err := os.CreateTemp("", "cleanlog-test-*.db")
	if err != nil {
		t.Fatalf("Failed to create temp file: %v", err)
	}
	t.Cleanup(func() { os.Remove(tmpFile.Name()) })
	tmpFile.Close()

	db, err := sql.Open("sqlite3", tmpFile.Name())
	if err != nil {
		t.Fatalf("Failed to open test database: %v", err)
	}

	migrationProvider := sqlite.NewMigrationProvider(db, tmpFile.Name())
	if err := migrationProvider.Migrate(); err != nil {
		t.Fatalf("Failed to run migrations: %v", err)
	}

	return db
}

func TestRegisterUserUseCase(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	userRepo := sqlite.NewUserRepository(db)
	useCase := usecases.NewRegisterUserUseCase(userRepo)

	t.Run("successful registration", func(t *testing.T) {
		regInput := input.RegisterUserInput{
			Email:    "test@example.com",
			Password: "securepassword123",
			FullName: "Test User",
			Role:     entities.UserRoleOwner,
		}

		result, err := useCase.Execute(context.Background(), regInput)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if result.ID == uuid.Nil {
			t.Error("expected non-nil ID")
		}
		if result.Email != "test@example.com" {
			t.Errorf("expected email test@example.com, got %s", result.Email)
		}
		if result.Role != entities.UserRoleOwner {
			t.Errorf("expected role owner, got %s", result.Role)
		}
	})

	t.Run("duplicate email", func(t *testing.T) {
		regInput := input.RegisterUserInput{
			Email:    "test@example.com",
			Password: "anotherpassword123",
			FullName: "Another User",
			Role:     entities.UserRoleCleaner,
		}

		_, err := useCase.Execute(context.Background(), regInput)
		if err == nil {
			t.Error("expected error for duplicate email")
		}
	})

	t.Run("invalid email format", func(t *testing.T) {
		regInput := input.RegisterUserInput{
			Email:    "invalid-email",
			Password: "password123456",
			FullName: "Test User",
			Role:     entities.UserRoleOwner,
		}

		_, err := useCase.Execute(context.Background(), regInput)
		if err == nil {
			t.Error("expected error for invalid email")
		}
	})

	t.Run("short password", func(t *testing.T) {
		regInput := input.RegisterUserInput{
			Email:    "short@example.com",
			Password: "short",
			FullName: "Test User",
			Role:     entities.UserRoleOwner,
		}

		_, err := useCase.Execute(context.Background(), regInput)
		if err == nil {
			t.Error("expected error for short password")
		}
	})
}

func TestLoginUseCase(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	userRepo := sqlite.NewUserRepository(db)
	useCase := usecases.NewLoginUseCase(userRepo, &mockTokenService{})

	// Pre-create a user for login tests
	user, err := entities.NewUser("login@test.com", "password123456", "Login User", entities.UserRoleCleaner)
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	if err := userRepo.Create(context.Background(), user); err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	t.Run("successful login", func(t *testing.T) {
		loginInput := input.LoginInput{
			Email:    "login@test.com",
			Password: "password123456",
		}

		result, err := useCase.Execute(context.Background(), loginInput)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if result.ID == uuid.Nil {
			t.Error("expected non-nil ID")
		}
		if result.Token == "" {
			t.Error("expected non-empty token")
		}
		if result.FullName != "Login User" {
			t.Errorf("expected full name Login User, got %s", result.FullName)
		}
	})

	t.Run("invalid email or password", func(t *testing.T) {
		loginInput := input.LoginInput{
			Email:    "login@test.com",
			Password: "wrongpassword",
		}

		_, err := useCase.Execute(context.Background(), loginInput)
		if err == nil {
			t.Error("expected error for wrong password")
		}
	})

	t.Run("non-existent user", func(t *testing.T) {
		loginInput := input.LoginInput{
			Email:    "nonexistent@test.com",
			Password: "password123456",
		}

		_, err := useCase.Execute(context.Background(), loginInput)
		if err == nil {
			t.Error("expected error for non-existent user")
		}
	})
}
