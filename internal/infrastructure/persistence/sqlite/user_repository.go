package sqlite

import (
	"context"
	"database/sql"
	"time"

	"cleanlog/internal/domain/entities"
	"cleanlog/internal/application/ports/output"
	"github.com/google/uuid"
)

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) ports.UserRepository {
	return &UserRepositoryImpl{db: db}
}

func (r *UserRepositoryImpl) Create(ctx context.Context, user *entities.User) error {
	query := `
		INSERT INTO users (id, email, password, full_name, role, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query,
		FormatUUID(user.ID),
		user.Email,
		user.Password,
		user.FullName,
		string(user.Role),
		time.Now(),
		time.Now(),
	)
	return err
}

func (r *UserRepositoryImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.User, error) {
	query := `
		SELECT id, email, password, full_name, role, created_at, updated_at
		FROM users WHERE id = ?
	`
	row := r.db.QueryRowContext(ctx, query, FormatUUID(id))
	return scanUser(row)
}

func (r *UserRepositoryImpl) GetByEmail(ctx context.Context, email string) (*entities.User, error) {
	query := `
		SELECT id, email, password, full_name, role, created_at, updated_at
		FROM users WHERE email = ?
	`
	row := r.db.QueryRowContext(ctx, query, email)
	return scanUser(row)
}

func (r *UserRepositoryImpl) Update(ctx context.Context, user *entities.User) error {
	query := `
		UPDATE users
		SET email = ?, password = ?, full_name = ?, role = ?, updated_at = ?
		WHERE id = ?
	`
	_, err := r.db.ExecContext(ctx, query,
		user.Email,
		user.Password,
		user.FullName,
		string(user.Role),
		time.Now(),
		FormatUUID(user.ID),
	)
	return err
}

func (r *UserRepositoryImpl) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM users WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, FormatUUID(id))
	return err
}

func (r *UserRepositoryImpl) List(ctx context.Context, role *entities.UserRole) ([]*entities.User, error) {
	query := `
		SELECT id, email, password, full_name, role, created_at, updated_at
		FROM users
	`
	args := []interface{}{}

	if role != nil {
		query += ` WHERE role = ?`
		args = append(args, string(*role))
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*entities.User
	for rows.Next() {
		user, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, rows.Err()
}

func scanUser(row RowScanner) (*entities.User, error) {
	var u entities.User
	var createdAt, updatedAt time.Time

	err := row.Scan(
		&u.ID,
		&u.Email,
		&u.Password,
		&u.FullName,
		(*string)(&u.Role),
		&createdAt,
		&updatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	u.CreatedAt = createdAt
	u.UpdatedAt = updatedAt

	return &u, nil
}

type RowScanner interface {
	Scan(dest ...interface{}) error
}
