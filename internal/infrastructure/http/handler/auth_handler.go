package handler

import (
	"cleanlog/internal/application/usecase"
	"encoding/json"
	"net/http"
)

type AuthHandler struct {
	registerUseCase *usecase.RegisterUserUseCase
	loginUseCase    *usecase.LoginUseCase
}

func NewAuthHandler(registerUseCase *usecase.RegisterUserUseCase, loginUseCase *usecase.LoginUseCase) *AuthHandler {
	return &AuthHandler{
		registerUseCase: registerUseCase,
		loginUseCase:    loginUseCase,
	}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var input usecase.RegisterUserInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.registerUseCase.Execute(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var input usecase.LoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.loginUseCase.Execute(input)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
	})
}
