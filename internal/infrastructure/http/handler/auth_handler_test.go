package handler

import (
	"cleanlog/internal/application/mocks"
	"cleanlog/internal/application/usecase"
	"cleanlog/internal/domain"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAuthHandler_Register_Success(t *testing.T) {
	userRepo := &mocks.MockUserRepository{
		CreateFn: func(user *domain.User) error {
			user.ID = "123"
			return nil
		},
	}

	uc := usecase.NewRegisterUserUseCase(userRepo)
	handler := NewAuthHandler(uc, nil)

	body := `{
		"name": "Jane Doe",
		"email": "jane@example.com",
		"password": "secret123",
		"role": "cleaner"
	}`

	req, err := http.NewRequest("POST", "/api/auth/register", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.Register(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("expected status 201, got %d", status)
	}

	var response map[string]interface{}
	json.Unmarshal(rr.Body.Bytes(), &response)

	if response["name"] != "Jane Doe" {
		t.Errorf("expected name 'Jane Doe', got %v", response["name"])
	}
}

func TestAuthHandler_Register_InvalidBody(t *testing.T) {
	userRepo := &mocks.MockUserRepository{}
	uc := usecase.NewRegisterUserUseCase(userRepo)
	handler := NewAuthHandler(uc, nil)

	req, err := http.NewRequest("POST", "/api/auth/register", strings.NewReader("invalid"))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler.Register(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", status)
	}
}

func TestAuthHandler_Login_Success(t *testing.T) {
	user := &domain.User{
		Email:    "jane@example.com",
		Password: "secret123",
	}

	userRepo := &mocks.MockUserRepository{
		GetByEmailFn: func(email string) (*domain.User, error) {
			return user, nil
		},
	}

	uc := usecase.NewLoginUseCase(userRepo)
	handler := NewAuthHandler(nil, uc)

	body := `{
		"email": "jane@example.com",
		"password": "secret123"
	}`

	req, err := http.NewRequest("POST", "/api/auth/login", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.Login(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("expected status 200, got %d", status)
	}
}

func TestAuthHandler_Login_InvalidCredentials(t *testing.T) {
	userRepo := &mocks.MockUserRepository{
		GetByEmailFn: func(email string) (*domain.User, error) {
			return nil, errors.New("user not found")
		},
	}

	uc := usecase.NewLoginUseCase(userRepo)
	handler := NewAuthHandler(nil, uc)

	body := `{
		"email": "jane@example.com",
		"password": "wrong"
	}`

	req, err := http.NewRequest("POST", "/api/auth/login", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.Login(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("expected status 401, got %d", status)
	}
}
