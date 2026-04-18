package ports

import "cleanlog/internal/domain/entities"

type TokenService interface {
	GenerateToken(userID, email string, role entities.UserRole, fullName string) (string, error)
	ParseAndValidate(tokenString string) (*entities.UserClaims, error)
}
