package sqlite

import (
	"context"
	"database/sql"
	"time"

	"cleanlog/internal/domain/entities"
	"cleanlog/internal/application/ports/output"
	"github.com/google/uuid"
)

type ScheduleRepositoryImpl struct {
	db *sql.DB
}

func NewScheduleRepository(db *sql.DB) ports.ScheduleRepository {
	return &ScheduleRepositoryImpl{db: db}
}

func (r *ScheduleRepositoryImpl) Create(ctx context.Context, schedule *entities.Schedule) error {
	query := `
		INSERT INTO schedules (id, task_id, cleaner_id, date, time_slot, active, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query,
		FormatUUID(schedule.ID),
		FormatUUID(schedule.TaskID),
		FormatUUID(schedule.CleanerID),
		schedule.Date,
		string(schedule.TimeSlot),
		bbool(schedule.Active),
		schedule.CreatedAt,
		schedule.UpdatedAt,
	)
	return err
}

func (r *ScheduleRepositoryImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.Schedule, error) {
	query := `
		SELECT id, task_id, cleaner_id, date, time_slot, active, created_at, updated_at
		FROM schedules WHERE id = ?
	`
	row := r.db.QueryRowContext(ctx, query, FormatUUID(id))
	return scanSchedule(row)
}

func (r *ScheduleRepositoryImpl) GetByTask(ctx context.Context, taskID uuid.UUID) ([]*entities.Schedule, error) {
	query := `
		SELECT id, task_id, cleaner_id, date, time_slot, active, created_at, updated_at
		FROM schedules WHERE task_id = ?
	`
	rows, err := r.db.QueryContext(ctx, query, FormatUUID(taskID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanSchedules(rows)
}

func (r *ScheduleRepositoryImpl) GetByCleaner(ctx context.Context, cleanerID uuid.UUID) ([]*entities.Schedule, error) {
	query := `
		SELECT id, task_id, cleaner_id, date, time_slot, active, created_at, updated_at
		FROM schedules WHERE cleaner_id = ?
	`
	rows, err := r.db.QueryContext(ctx, query, FormatUUID(cleanerID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanSchedules(rows)
}

func (r *ScheduleRepositoryImpl) Update(ctx context.Context, schedule *entities.Schedule) error {
	query := `
		UPDATE schedules
		SET task_id = ?, cleaner_id = ?, date = ?, time_slot = ?, active = ?, updated_at = ?
		WHERE id = ?
	`
	_, err := r.db.ExecContext(ctx, query,
		FormatUUID(schedule.TaskID),
		FormatUUID(schedule.CleanerID),
		schedule.Date,
		string(schedule.TimeSlot),
		bbool(schedule.Active),
		schedule.UpdatedAt,
		FormatUUID(schedule.ID),
	)
	return err
}

func (r *ScheduleRepositoryImpl) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM schedules WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, FormatUUID(id))
	return err
}

func (r *ScheduleRepositoryImpl) ListActive(ctx context.Context) ([]*entities.Schedule, error) {
	query := `
		SELECT id, task_id, cleaner_id, date, time_slot, active, created_at, updated_at
		FROM schedules WHERE active = 1
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanSchedules(rows)
}

func scanSchedule(row RowScanner) (*entities.Schedule, error) {
	var s entities.Schedule
	var createdAt, updatedAt time.Time

	err := row.Scan(
		&s.ID,
		&s.TaskID,
		&s.CleanerID,
		&s.Date,
		(*string)(&s.TimeSlot),
		&s.Active,
		&createdAt,
		&updatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	s.CreatedAt = createdAt
	s.UpdatedAt = updatedAt

	return &s, nil
}

func scanSchedules(rows *sql.Rows) ([]*entities.Schedule, error) {
	var schedules []*entities.Schedule
	for rows.Next() {
		schedule, err := scanSchedule(rows)
		if err != nil {
			return nil, err
		}
		schedules = append(schedules, schedule)
	}
	return schedules, rows.Err()
}

func bbool(b bool) int {
	if b {
		return 1
	}
	return 0
}
