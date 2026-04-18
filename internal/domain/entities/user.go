package entities

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserClaims struct {
	UserID   string    `json:"user_id"`
	Email    string    `json:"email"`
	Role     UserRole  `json:"role"`
	FullName string    `json:"full_name"`
}

type UserRole string

const (
	UserRoleCleaner UserRole = "cleaner"
	UserRoleOwner   UserRole = "owner"
)

type User struct {
	ID        uuid.UUID
	Email     string
	Password  string
	Role      UserRole
	FullName  string
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewUser(email, password, fullName string, role UserRole) (*User, error) {
	trimmedEmail := strings.TrimSpace(email)
	trimmedFullName := strings.TrimSpace(fullName)

	if trimmedEmail == "" {
		return nil, errors.New("email is required")
	}
	if strings.Contains(trimmedEmail, "@") == false {
		return nil, errors.New("invalid email format")
	}
	if len(password) < 8 {
		return nil, errors.New("password must be at least 8 characters")
	}
	if trimmedFullName == "" {
		return nil, errors.New("full name is required")
	}
	if role != UserRoleCleaner && role != UserRoleOwner {
		return nil, errors.New("invalid role")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return &User{
		ID:        uuid.New(),
		Email:     strings.ToLower(trimmedEmail),
		Password:  string(hashedPassword),
		Role:      role,
		FullName:  trimmedFullName,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (u *User) UpdatePassword(newPassword string) error {
	if len(newPassword) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	u.UpdatedAt = time.Now()
	return nil
}

func (u *User) UpdateFullName(fullName string) error {
	trimmedFullName := strings.TrimSpace(fullName)
	if trimmedFullName == "" {
		return errors.New("full name is required")
	}
	u.FullName = trimmedFullName
	u.UpdatedAt = time.Now()
	return nil
}
