package main

import (
	"cleanlog/internal/application/usecase"
	"cleanlog/internal/infrastructure/http/handler"
	"cleanlog/internal/infrastructure/persistence/sqlite"
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "cleanlog.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	initDB(db)

	userRepo := sqlite.NewUserRepository(db)
	taskRepo := sqlite.NewTaskRepository(db)

	registerUseCase := usecase.NewRegisterUserUseCase(userRepo)
	loginUseCase := usecase.NewLoginUseCase(userRepo)
	getCleanerTasksUseCase := usecase.NewGetCleanerTasksUseCase(taskRepo)
	completeTaskUseCase := usecase.NewCompleteTaskUseCase(taskRepo)
	getOwnerTasksUseCase := usecase.NewGetOwnerTasksUseCase(taskRepo)
	createTaskUseCase := usecase.NewCreateTaskUseCase(taskRepo)

	authHandler := handler.NewAuthHandler(registerUseCase, loginUseCase)
	taskHandler := handler.NewTaskHandler(getCleanerTasksUseCase, completeTaskUseCase)
	ownerTaskHandler := handler.NewOwnerTaskHandler(createTaskUseCase, getOwnerTasksUseCase)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"hello world"}`))
	})
	mux.HandleFunc("/api/auth/register", authHandler.Register)
	mux.HandleFunc("/api/auth/login", authHandler.Login)
	mux.HandleFunc("/api/tasks", taskHandler.ListCleanerTasks)
	mux.HandleFunc("/api/tasks/", taskHandler.CompleteTask)
	mux.HandleFunc("/api/owner/tasks", ownerTaskHandler.Create)
	mux.HandleFunc("/api/owner/tasks", ownerTaskHandler.List)

	middleware := &handler.AuthMiddleware{}
	protectedHandler := middleware.RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("protected"))
	}))
	mux.Handle("/api/protected", protectedHandler)

	fs := http.FileServer(http.Dir("web"))
	mux.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}

func initDB(db *sql.DB) {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		role TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS tasks (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT,
		type TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'pending',
		scheduled_at TEXT,
		cleaner_id TEXT,
		owner_id TEXT
	);

	CREATE TABLE IF NOT EXISTS schedules (
		id TEXT PRIMARY KEY,
		task_id TEXT NOT NULL,
		date TEXT NOT NULL
	);
	`
	_, err := db.Exec(schema)
	if err != nil {
		log.Fatal(err)
	}
}
