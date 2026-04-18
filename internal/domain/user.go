package domain

import (
	"fmt"

	"github.com/google/uuid"
)

type Role string

const (
	RoleCleaner Role = "cleaner"
	RoleOwner   Role = "owner"
)

type User struct {
	ID       string
	Name     string
	Email    string
	Password string
	Role     Role
}

func (u *User) GenerateID() {
	u.ID = uuid.New().String()
}

func (u *User) Validate() error {
	if u.ID == "" {
		return fmt.Errorf("id is required")
	}
	if u.Name == "" {
		return fmt.Errorf("name is required")
	}
	if u.Email == "" {
		return fmt.Errorf("email is required")
	}
	if u.Password == "" {
		return fmt.Errorf("password is required")
	}
	if u.Role != RoleCleaner && u.Role != RoleOwner {
		return fmt.Errorf("invalid role")
	}
	return nil
}
