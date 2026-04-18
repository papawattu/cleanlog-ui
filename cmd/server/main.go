package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	input "cleanlog/internal/application/ports/input"
	"cleanlog/internal/infrastructure/auth"
	"cleanlog/internal/infrastructure/persistence/sqlite"
	usecases "cleanlog/internal/usecase"
	_ "github.com/mattn/go-sqlite3"
)

func mainHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, Cleanlog!")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "OK")
}

func registerHandler(useCase input.RegisterUseCase, jwtService auth.TokenGenerator) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req input.RegisterUserInput
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		token, err := jwtService.GenerateToken(result.ID.String(), result.Email, result.Role, result.FullName)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":       result.ID.String(),
			"email":    result.Email,
			"role":     result.Role,
			"fullName": result.FullName,
			"token":    token,
		})
	}
}

func loginHandler(useCase input.LoginUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req input.LoginInput
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":       result.ID.String(),
			"email":    result.Email,
			"role":     result.Role,
			"fullName": result.FullName,
			"token":    result.Token,
		})
	}
}

func createTaskHandler(useCase input.CreateTaskUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req input.CreateTaskInput
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":             result.ID,
			"title":          result.Title,
			"description":    result.Description,
			"task_type":      string(result.TaskType),
			"status":         string(result.Status),
			"assigned_to":    result.AssignedTo,
			"scheduled_date": result.ScheduledDate,
			"scheduled_time": result.ScheduledTime,
			"created_by":     result.CreatedBy,
			"created_at":     result.CreatedAt,
			"updated_at":     result.UpdatedAt,
			"completed_at":   result.CompletedAt,
		})
	}
}

func main() {
	db, err := sql.Open("sqlite3", "cleanlog.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	migrationProvider := sqlite.NewMigrationProvider(db, "cleanlog.db")
	if err := migrationProvider.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	userRepo := sqlite.NewUserRepository(db)
	taskRepo := sqlite.NewTaskRepository(db)

	jwtService, err := auth.NewJWTService()
	if err != nil {
		log.Fatalf("Failed to create JWT service: %v", err)
	}

	registerUseCase := usecases.NewRegisterUserUseCase(userRepo)
	loginUseCase := usecases.NewLoginUseCase(userRepo, jwtService)
	createTaskUseCase := usecases.NewCreateTaskUseCase(taskRepo)
	listTasksUseCase := usecases.NewListTasksUseCase(taskRepo)
	completeTaskUseCase := usecases.NewCompleteTaskUseCase(taskRepo)
	updateTaskStatusUseCase := usecases.NewUpdateTaskStatusUseCase(taskRepo)
	deleteTaskUseCase := usecases.NewDeleteTaskUseCase(taskRepo)

	scheduleRepo := sqlite.NewScheduleRepository(db)
	createScheduleUseCase := usecases.NewCreateScheduleUseCase(scheduleRepo, taskRepo)
	listSchedulesUseCase := usecases.NewListSchedulesUseCase(scheduleRepo)
	updateScheduleUseCase := usecases.NewUpdateScheduleUseCase(scheduleRepo)
	deleteScheduleUseCase := usecases.NewDeleteScheduleUseCase(scheduleRepo)

	listUsersUseCase := usecases.NewListUsersUseCase(userRepo)

	publicMux := http.NewServeMux()
	publicMux.HandleFunc("/", mainHandler)
	publicMux.HandleFunc("/health", healthHandler)
	publicMux.HandleFunc("/register", registerHandler(registerUseCase, jwtService))
	publicMux.HandleFunc("/login", loginHandler(loginUseCase))

	authenticatedMux := http.NewServeMux()
	authenticatedMux.HandleFunc("/tasks", tasksHandler(createTaskUseCase, listTasksUseCase))
	authenticatedMux.HandleFunc("/tasks/complete/", completeTaskHandler(completeTaskUseCase))
	authenticatedMux.HandleFunc("/tasks/status/", updateTaskStatusHandler(updateTaskStatusUseCase))
	authenticatedMux.HandleFunc("/tasks/delete/", deleteTaskHandler(deleteTaskUseCase))
	authenticatedMux.HandleFunc("/schedules", schedulesHandler(createScheduleUseCase, listSchedulesUseCase))
	authenticatedMux.HandleFunc("/schedules/", updateScheduleHandler(updateScheduleUseCase))
	authenticatedMux.HandleFunc("/schedules/delete/", deleteScheduleHandler(deleteScheduleUseCase))
	authenticatedMux.HandleFunc("/users/list", listUsersHandler(listUsersUseCase))

	authHandler := auth.AuthMiddleware(jwtService)(authenticatedMux)

	mux := http.NewServeMux()
	mux.Handle("/health", http.HandlerFunc(healthHandler))
	mux.Handle("/register", http.HandlerFunc(registerHandler(registerUseCase, jwtService)))
	mux.Handle("/login", http.HandlerFunc(loginHandler(loginUseCase)))
	mux.Handle("/tasks", authHandler)
	mux.Handle("/tasks/", authHandler)
	mux.Handle("/schedules", authHandler)
	mux.Handle("/schedules/", authHandler)
	mux.Handle("/users/", authHandler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, Cleanlog!")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
