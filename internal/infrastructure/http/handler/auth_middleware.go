package handler

import (
	"cleanlog/internal/domain"
	"context"
	"net/http"
)

type contextKey string

const AuthUserKey contextKey = "authUser"

type AuthMiddleware struct{}

func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		_ = cookie.Value

		user := &domain.User{
			ID:    "placeholder",
			Name:  "placeholder",
			Email: "placeholder@example.com",
			Role:  domain.RoleCleaner,
		}

		ctx := context.WithValue(r.Context(), AuthUserKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
