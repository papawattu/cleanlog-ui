package sqlite

import (
	"cleanlog/internal/domain"
	"database/sql"
)

type TaskRepository struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) Create(task *domain.Task) error {
	query := `INSERT INTO tasks (id, title, description, type, status, scheduled_at, cleaner_id, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := r.db.Exec(query, task.ID, task.Title, task.Description, task.Type, task.Status, task.ScheduledAt, task.CleanerID, task.OwnerID)
	return err
}

func (r *TaskRepository) GetByID(id string) (*domain.Task, error) {
	task := &domain.Task{}
	query := `SELECT id, title, description, type, status, scheduled_at, cleaner_id, owner_id FROM tasks WHERE id = ?`
	err := r.db.QueryRow(query, id).Scan(&task.ID, &task.Title, &task.Description, &task.Type, &task.Status, &task.ScheduledAt, &task.CleanerID, &task.OwnerID)
	if err != nil {
		return nil, err
	}
	return task, nil
}

func (r *TaskRepository) Update(task *domain.Task) error {
	query := `UPDATE tasks SET title = ?, description = ?, type = ?, status = ?, scheduled_at = ?, cleaner_id = ?, owner_id = ? WHERE id = ?`
	_, err := r.db.Exec(query, task.Title, task.Description, task.Type, task.Status, task.ScheduledAt, task.CleanerID, task.OwnerID, task.ID)
	return err
}

func (r *TaskRepository) Delete(id string) error {
	query := `DELETE FROM tasks WHERE id = ?`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *TaskRepository) List() ([]*domain.Task, error) {
	query := `SELECT id, title, description, type, status, scheduled_at, cleaner_id, owner_id FROM tasks`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*domain.Task
	for rows.Next() {
		task := &domain.Task{}
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Type, &task.Status, &task.ScheduledAt, &task.CleanerID, &task.OwnerID); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (r *TaskRepository) FindByCleanerID(cleanerID string) ([]*domain.Task, error) {
	query := `SELECT id, title, description, type, status, scheduled_at, cleaner_id, owner_id FROM tasks WHERE cleaner_id = ?`
	rows, err := r.db.Query(query, cleanerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*domain.Task
	for rows.Next() {
		task := &domain.Task{}
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Type, &task.Status, &task.ScheduledAt, &task.CleanerID, &task.OwnerID); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (r *TaskRepository) FindByOwnerID(ownerID string) ([]*domain.Task, error) {
	query := `SELECT id, title, description, type, status, scheduled_at, cleaner_id, owner_id FROM tasks WHERE owner_id = ?`
	rows, err := r.db.Query(query, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*domain.Task
	for rows.Next() {
		task := &domain.Task{}
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Type, &task.Status, &task.ScheduledAt, &task.CleanerID, &task.OwnerID); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}
