package domain

type UserRepository interface {
	Create(user *User) error
	GetByID(id string) (*User, error)
	GetByEmail(email string) (*User, error)
	Update(user *User) error
	Delete(id string) error
	List() ([]*User, error)
}

type TaskRepository interface {
	Create(task *Task) error
	GetByID(id string) (*Task, error)
	Update(task *Task) error
	Delete(id string) error
	List() ([]*Task, error)
	FindByCleanerID(cleanerID string) ([]*Task, error)
	FindByOwnerID(ownerID string) ([]*Task, error)
}

type ScheduleRepository interface {
	Create(schedule *Schedule) error
	GetByID(id string) (*Schedule, error)
	Update(schedule *Schedule) error
	Delete(id string) error
	List() ([]*Schedule, error)
	FindByTaskID(taskID string) ([]*Schedule, error)
}
