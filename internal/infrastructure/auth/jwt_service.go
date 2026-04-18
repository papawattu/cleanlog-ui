package auth

import (
	"errors"
	"fmt"
	"os"
	"time"

	"cleanlog/internal/domain/entities"
	"github.com/golang-jwt/jwt/v5"
)

type TokenGenerator interface {
	GenerateToken(userID, email string, role entities.UserRole, fullName string) (string, error)
}

type jwtService struct {
	secretKey           string
	accessTokenDuration time.Duration
}

func NewJWTService() (*jwtService, error) {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "change-this-in-production"
	}

	return &jwtService{
		secretKey:           secretKey,
		accessTokenDuration: 24 * time.Hour,
	}, nil
}

func (s *jwtService) GenerateToken(userID, email string, role entities.UserRole, fullName string) (string, error) {
	claims := &jwt.RegisteredClaims{
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.accessTokenDuration)),
		Issuer:    "cleanlog",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token.Claims.(*jwt.RegisteredClaims).Subject = userID

	// Store role and full_name as custom claims
	// We'll use a custom claims struct for signing
	type signingClaims struct {
		UserID   string            `json:"user_id"`
		Email    string            `json:"email"`
		Role     entities.UserRole `json:"role"`
		FullName string            `json:"full_name"`
		jwt.RegisteredClaims
	}

	sc := &signingClaims{
		UserID:   userID,
		Email:    email,
		Role:     role,
		FullName: fullName,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.accessTokenDuration)),
			Issuer:    "cleanlog",
			Subject:   userID,
		},
	}

	token = jwt.NewWithClaims(jwt.SigningMethodHS256, sc)
	return token.SignedString([]byte(s.secretKey))
}

func (s *jwtService) ParseAndValidate(tokenString string) (*entities.UserClaims, error) {
	type signingClaims struct {
		UserID   string            `json:"user_id"`
		Email    string            `json:"email"`
		Role     entities.UserRole `json:"role"`
		FullName string            `json:"full_name"`
		jwt.RegisteredClaims
	}

	token, err := jwt.ParseWithClaims(tokenString, &signingClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.secretKey), nil
	})
	if err != nil {
		return nil, errors.New("invalid or expired token")
	}

	claims, ok := token.Claims.(*signingClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	return &entities.UserClaims{
		UserID:   claims.UserID,
		Email:    claims.Email,
		Role:     claims.Role,
		FullName: claims.FullName,
	}, nil
}
