package sqlite

import (
	"cleanlog/internal/domain"
	"database/sql"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *domain.User) error {
	query := `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`
	_, err := r.db.Exec(query, user.ID, user.Name, user.Email, user.Password, user.Role)
	return err
}

func (r *UserRepository) GetByID(id string) (*domain.User, error) {
	user := &domain.User{}
	query := `SELECT id, name, email, password, role FROM users WHERE id = ?`
	err := r.db.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) GetByEmail(email string) (*domain.User, error) {
	user := &domain.User{}
	query := `SELECT id, name, email, password, role FROM users WHERE email = ?`
	err := r.db.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) Update(user *domain.User) error {
	query := `UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?`
	_, err := r.db.Exec(query, user.Name, user.Email, user.Password, user.Role, user.ID)
	return err
}

func (r *UserRepository) Delete(id string) error {
	query := `DELETE FROM users WHERE id = ?`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *UserRepository) List() ([]*domain.User, error) {
	query := `SELECT id, name, email, password, role FROM users`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		user := &domain.User{}
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Role); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}
