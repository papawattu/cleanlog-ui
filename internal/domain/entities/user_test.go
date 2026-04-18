package entities

import (
	"testing"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func TestNewUser(t *testing.T) {
	tests := []struct {
		name       string
		email      string
		password   string
		fullName   string
		role       UserRole
		wantErr    bool
		errMessage string
	}{
		{
			name:       "valid cleaner user",
			email:      "cleaner@example.com",
			password:   "securepass123",
			fullName:   "John Cleaner",
			role:       UserRoleCleaner,
			wantErr:    false,
			errMessage: "",
		},
		{
			name:       "valid owner user",
			email:      "owner@example.com",
			password:   "securepass123",
			fullName:   "Jane Owner",
			role:       UserRoleOwner,
			wantErr:    false,
			errMessage: "",
		},
		{
			name:       "empty email",
			email:      "",
			password:   "securepass123",
			fullName:   "Test User",
			role:       UserRoleCleaner,
			wantErr:    true,
			errMessage: "email is required",
		},
		{
			name:       "invalid email format",
			email:      "invalid-email",
			password:   "securepass123",
			fullName:   "Test User",
			role:       UserRoleCleaner,
			wantErr:    true,
			errMessage: "invalid email format",
		},
		{
			name:       "short password",
			email:      "user@example.com",
			password:   "short",
			fullName:   "Test User",
			role:       UserRoleCleaner,
			wantErr:    true,
			errMessage: "password must be at least 8 characters",
		},
		{
			name:       "empty full name",
			email:      "user@example.com",
			password:   "securepass123",
			fullName:   "",
			role:       UserRoleCleaner,
			wantErr:    true,
			errMessage: "full name is required",
		},
		{
			name:       "invalid role",
			email:      "user@example.com",
			password:   "securepass123",
			fullName:   "Test User",
			role:       UserRole("invalid"),
			wantErr:    true,
			errMessage: "invalid role",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			user, err := NewUser(tt.email, tt.password, tt.fullName, tt.role)

			if tt.wantErr {
				if err == nil {
					t.Errorf("expected error, got nil")
					return
				}
				if err.Error() != tt.errMessage {
					t.Errorf("expected error %q, got %q", tt.errMessage, err.Error())
				}
				return
			}

			if err != nil {
				t.Errorf("expected no error, got %v", err)
				return
			}

			if user.ID == uuid.Nil {
				t.Error("expected non-nil UUID")
			}
			if user.Email != tt.email {
				t.Errorf("expected email %q, got %q", tt.email, user.Email)
			}
			if user.Role != tt.role {
				t.Errorf("expected role %q, got %q", tt.role, user.Role)
			}
			if user.FullName != tt.fullName {
				t.Errorf("expected fullname %q, got %q", tt.fullName, user.FullName)
			}
		})
	}
}

func TestUpdatePassword(t *testing.T) {
	user, _ := NewUser("test@example.com", "oldpassword123", "Test User", UserRoleCleaner)

	err := user.UpdatePassword("newpassword123")
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("newpassword123"))
	if err != nil {
		t.Errorf("expected password to be updated to newpassword123")
	}

	err = user.UpdatePassword("short")
	if err == nil {
		t.Error("expected error for short password")
	}
	if err.Error() != "password must be at least 8 characters" {
		t.Errorf("expected 'password must be at least 8 characters', got %q", err.Error())
	}
}

func TestUpdateFullName(t *testing.T) {
	user, _ := NewUser("test@example.com", "oldpassword123", "Test User", UserRoleCleaner)

	err := user.UpdateFullName("Updated Name")
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if user.FullName != "Updated Name" {
		t.Errorf("expected fullname to be updated")
	}

	err = user.UpdateFullName("   ")
	if err == nil {
		t.Error("expected error for empty full name")
	}
	if err.Error() != "full name is required" {
		t.Errorf("expected 'full name is required', got %q", err.Error())
	}
}
