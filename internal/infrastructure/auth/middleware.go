package auth

import (
	"context"
	"net/http"
	"strings"

	"cleanlog/internal/domain/entities"
)

type contextKey string

const userClaimsKey contextKey = "userClaims"

func AuthMiddleware(service *jwtService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Authorization header required", http.StatusUnauthorized)
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
				return
			}

			claims, err := service.ParseAndValidate(parts[1])
			if err != nil {
				http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetClaimsFromContext(ctx context.Context) *entities.UserClaims {
	claims, ok := ctx.Value(userClaimsKey).(*entities.UserClaims)
	if !ok || claims == nil {
		return nil
	}
	return claims
}
