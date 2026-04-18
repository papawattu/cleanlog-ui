package auth

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"cleanlog/internal/domain/entities"
)

func TestAuthMiddleware(t *testing.T) {
	service, err := NewJWTService()
	if err != nil {
		t.Fatalf("Failed to create JWT service: %v", err)
	}

	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := AuthMiddleware(service)
	handler := middleware(nextHandler)

	t.Run("missing authorization header", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		w := httptest.NewRecorder()

		handler.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("expected status %d, got %d", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("invalid authorization format", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		req.Header.Set("Authorization", "InvalidFormat token")
		w := httptest.NewRecorder()

		handler.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("expected status %d, got %d", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("invalid token", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		req.Header.Set("Authorization", "Bearer invalid-token-string")
		w := httptest.NewRecorder()

		handler.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("expected status %d, got %d", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("valid token passes through", func(t *testing.T) {
		user, _ := entities.NewUser("middleware@test.com", "password123456", "Middleware User", entities.UserRoleOwner)
		token, err := service.GenerateToken(user.ID.String(), user.Email, user.Role, user.FullName)
		if err != nil {
			t.Fatalf("Failed to generate token: %v", err)
		}

		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()

		handler.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status %d, got %d", http.StatusOK, w.Code)
		}
	})

	t.Run("claims stored in context", func(t *testing.T) {
		user, _ := entities.NewUser("claims@test.com", "password123456", "Claims User", entities.UserRoleCleaner)
		token, err := service.GenerateToken(user.ID.String(), user.Email, user.Role, user.FullName)
		if err != nil {
			t.Fatalf("Failed to generate token: %v", err)
		}

		nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims := GetClaimsFromContext(r.Context())
			if claims == nil {
				t.Fatal("expected claims in context, got nil")
			}
			if claims.UserID != user.ID.String() {
				t.Errorf("expected userID %s, got %s", user.ID.String(), claims.UserID)
			}
			if claims.Email != user.Email {
				t.Errorf("expected email %s, got %s", user.Email, claims.Email)
			}
			if claims.Role != user.Role {
				t.Errorf("expected role %s, got %s", user.Role, claims.Role)
			}
			if claims.FullName != user.FullName {
				t.Errorf("expected full name %s, got %s", user.FullName, claims.FullName)
			}
			w.WriteHeader(http.StatusOK)
		})

		handler := middleware(nextHandler)

		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()

		handler.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status %d, got %d", http.StatusOK, w.Code)
		}
	})
}

func TestGetClaimsFromContext(t *testing.T) {
	t.Run("nil claims returns nil", func(t *testing.T) {
		ctx := context.Background()
		claims := GetClaimsFromContext(ctx)
		if claims != nil {
			t.Error("expected nil claims for empty context")
		}
	})
}
