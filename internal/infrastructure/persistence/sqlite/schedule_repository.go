package sqlite

import (
	"cleanlog/internal/domain"
	"database/sql"
)

type ScheduleRepository struct {
	db *sql.DB
}

func NewScheduleRepository(db *sql.DB) *ScheduleRepository {
	return &ScheduleRepository{db: db}
}

func (r *ScheduleRepository) Create(schedule *domain.Schedule) error {
	query := `INSERT INTO schedules (id, task_id, date) VALUES (?, ?, ?)`
	_, err := r.db.Exec(query, schedule.ID, schedule.TaskID, schedule.Date)
	return err
}

func (r *ScheduleRepository) GetByID(id string) (*domain.Schedule, error) {
	schedule := &domain.Schedule{}
	query := `SELECT id, task_id, date FROM schedules WHERE id = ?`
	err := r.db.QueryRow(query, id).Scan(&schedule.ID, &schedule.TaskID, &schedule.Date)
	if err != nil {
		return nil, err
	}
	return schedule, nil
}

func (r *ScheduleRepository) Update(schedule *domain.Schedule) error {
	query := `UPDATE schedules SET task_id = ?, date = ? WHERE id = ?`
	_, err := r.db.Exec(query, schedule.TaskID, schedule.Date, schedule.ID)
	return err
}

func (r *ScheduleRepository) Delete(id string) error {
	query := `DELETE FROM schedules WHERE id = ?`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *ScheduleRepository) List() ([]*domain.Schedule, error) {
	query := `SELECT id, task_id, date FROM schedules`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var schedules []*domain.Schedule
	for rows.Next() {
		schedule := &domain.Schedule{}
		if err := rows.Scan(&schedule.ID, &schedule.TaskID, &schedule.Date); err != nil {
			return nil, err
		}
		schedules = append(schedules, schedule)
	}
	return schedules, nil
}

func (r *ScheduleRepository) FindByTaskID(taskID string) ([]*domain.Schedule, error) {
	query := `SELECT id, task_id, date FROM schedules WHERE task_id = ?`
	rows, err := r.db.Query(query, taskID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var schedules []*domain.Schedule
	for rows.Next() {
		schedule := &domain.Schedule{}
		if err := rows.Scan(&schedule.ID, &schedule.TaskID, &schedule.Date); err != nil {
			return nil, err
		}
		schedules = append(schedules, schedule)
	}
	return schedules, nil
}
