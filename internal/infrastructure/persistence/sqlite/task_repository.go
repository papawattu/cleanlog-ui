package sqlite

import (
	"context"
	"database/sql"
	"time"

	"cleanlog/internal/domain/entities"
	"cleanlog/internal/application/ports/output"
	"github.com/google/uuid"
)

type TaskRepositoryImpl struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) ports.TaskRepository {
	return &TaskRepositoryImpl{db: db}
}

func (r *TaskRepositoryImpl) Create(ctx context.Context, task *entities.Task) error {
	query := `
		INSERT INTO tasks (id, title, description, task_type, status, assigned_to, scheduled_date, scheduled_time, created_by, created_at, updated_at, completed_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	var completedAt interface{}
	if task.CompletedAt != nil {
		completedAt = *task.CompletedAt
	} else {
		completedAt = sql.NullTime{Valid: false}
	}

	_, err := r.db.ExecContext(ctx, query,
		FormatUUID(task.ID),
		task.Title,
		task.Description,
		string(task.TaskType),
		string(task.Status),
		FormatUUID(task.AssignedTo),
		task.ScheduledDate,
		task.ScheduledTime,
		FormatUUID(task.CreatedBy),
		task.CreatedAt,
		task.UpdatedAt,
		completedAt,
	)
	return err
}

func (r *TaskRepositoryImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.Task, error) {
	query := `
		SELECT id, title, description, task_type, status, assigned_to, scheduled_date, scheduled_time, created_by, created_at, updated_at, completed_at
		FROM tasks WHERE id = ?
	`
	row := r.db.QueryRowContext(ctx, query, FormatUUID(id))
	return scanTask(row)
}

func (r *TaskRepositoryImpl) GetByStatus(ctx context.Context, status entities.TaskStatus) ([]*entities.Task, error) {
	query := `
		SELECT id, title, description, task_type, status, assigned_to, scheduled_date, scheduled_time, created_by, created_at, updated_at, completed_at
		FROM tasks WHERE status = ?
	`
	rows, err := r.db.QueryContext(ctx, query, string(status))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanTasks(rows)
}

func (r *TaskRepositoryImpl) GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Task, error) {
	query := `
		SELECT id, title, description, task_type, status, assigned_to, scheduled_date, scheduled_time, created_by, created_at, updated_at, completed_at
		FROM tasks WHERE assigned_to = ?
	`
	rows, err := r.db.QueryContext(ctx, query, FormatUUID(cleanerID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanTasks(rows)
}

func (r *TaskRepositoryImpl) GetByOwner(ctx context.Context, ownerID uuid.UUID) ([]*entities.Task, error) {
	query := `
		SELECT id, title, description, task_type, status, assigned_to, scheduled_date, scheduled_time, created_by, created_at, updated_at, completed_at
		FROM tasks WHERE created_by = ?
	`
	rows, err := r.db.QueryContext(ctx, query, FormatUUID(ownerID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanTasks(rows)
}

func (r *TaskRepositoryImpl) Update(ctx context.Context, task *entities.Task) error {
	query := `
		UPDATE tasks
		SET title = ?, description = ?, task_type = ?, status = ?, assigned_to = ?, scheduled_date = ?, scheduled_time = ?, created_by = ?, updated_at = ?, completed_at = ?
		WHERE id = ?
	`
	var completedAt interface{}
	if task.CompletedAt != nil {
		completedAt = *task.CompletedAt
	} else {
		completedAt = sql.NullTime{Valid: false}
	}

	_, err := r.db.ExecContext(ctx, query,
		task.Title,
		task.Description,
		string(task.TaskType),
		string(task.Status),
		FormatUUID(task.AssignedTo),
		task.ScheduledDate,
		task.ScheduledTime,
		FormatUUID(task.CreatedBy),
		task.UpdatedAt,
		completedAt,
		FormatUUID(task.ID),
	)
	return err
}

func (r *TaskRepositoryImpl) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM tasks WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, FormatUUID(id))
	return err
}

func scanTask(row RowScanner) (*entities.Task, error) {
	var t entities.Task
	var createdAt, updatedAt time.Time
	var completedAtStr sql.NullString
	var completedAt time.Time

	err := row.Scan(
		&t.ID,
		&t.Title,
		&t.Description,
		(*string)(&t.TaskType),
		(*string)(&t.Status),
		&t.AssignedTo,
		&t.ScheduledDate,
		&t.ScheduledTime,
		&t.CreatedBy,
		&createdAt,
		&updatedAt,
		&completedAtStr,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if completedAtStr.Valid {
		completedAt, _ = time.Parse(time.RFC3339, completedAtStr.String)
		t.CompletedAt = &completedAt
	}

	t.CreatedAt = createdAt
	t.UpdatedAt = updatedAt

	return &t, nil
}

func scanTasks(rows *sql.Rows) ([]*entities.Task, error) {
	var tasks []*entities.Task
	for rows.Next() {
		task, err := scanTask(rows)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, rows.Err()
}
