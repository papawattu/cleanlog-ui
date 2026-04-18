package usecase

import "cleanlog/internal/domain"

type CreateScheduleInput struct {
	TaskID string
	Date   string
}

type CreateScheduleUseCase struct {
	scheduleRepo domain.ScheduleRepository
}

func NewCreateScheduleUseCase(scheduleRepo domain.ScheduleRepository) *CreateScheduleUseCase {
	return &CreateScheduleUseCase{scheduleRepo: scheduleRepo}
}

func (uc *CreateScheduleUseCase) Execute(input CreateScheduleInput) (*domain.Schedule, error) {
	schedule := &domain.Schedule{
		TaskID: input.TaskID,
		Date:   input.Date,
	}

	schedule.GenerateID()

	if err := schedule.Validate(); err != nil {
		return nil, err
	}

	if err := uc.scheduleRepo.Create(schedule); err != nil {
		return nil, err
	}

	return schedule, nil
}
