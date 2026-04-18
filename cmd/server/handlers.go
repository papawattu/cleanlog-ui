package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	input "cleanlog/internal/application/ports/input"
	"cleanlog/internal/domain/entities"
	"cleanlog/internal/infrastructure/auth"
	"github.com/google/uuid"
)

func tasksHandler(createUseCase input.CreateTaskUseCase, listUseCase input.ListTasksUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		switch r.Method {
		case http.MethodGet:
			listTasksHandler(listUseCase)(w, r)
		case http.MethodPost:
			createTaskHandler(createUseCase)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func schedulesHandler(createUseCase input.CreateScheduleUseCase, listUseCase input.ListSchedulesUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		switch r.Method {
		case http.MethodGet:
			listSchedulesHandler(listUseCase)(w, r)
		case http.MethodPost:
			createScheduleHandler(createUseCase)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func listTasksHandler(useCase input.ListTasksUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		cleanerID := r.URL.Query().Get("cleaner_id")
		ownerID := r.URL.Query().Get("owner_id")
		status := r.URL.Query().Get("status")

		var cleanerIDParsed *uuid.UUID
		var ownerIDParsed *uuid.UUID
		var statusParsed *entities.TaskStatus

		if cleanerID != "" {
			id, err := uuid.Parse(cleanerID)
			if err != nil {
				http.Error(w, "Invalid cleaner_id", http.StatusBadRequest)
				return
			}
			cleanerIDParsed = &id
		}

		if ownerID != "" {
			id, err := uuid.Parse(ownerID)
			if err != nil {
				http.Error(w, "Invalid owner_id", http.StatusBadRequest)
				return
			}
			ownerIDParsed = &id
		}

		if status != "" {
			s := entities.TaskStatus(status)
			statusParsed = &s
		}

		result, err := useCase.Execute(r.Context(), input.ListTasksInput{
			CleanerID: cleanerIDParsed,
			OwnerID:   ownerIDParsed,
			Status:    statusParsed,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		tasks := make([]map[string]interface{}, 0, len(result.Tasks))
		for _, task := range result.Tasks {
			tasks = append(tasks, map[string]interface{}{
				"id":             task.ID,
				"title":          task.Title,
				"description":    task.Description,
				"task_type":      string(task.TaskType),
				"status":         string(task.Status),
				"assigned_to":    task.AssignedTo,
				"scheduled_date": task.ScheduledDate,
				"scheduled_time": task.ScheduledTime,
				"created_by":     task.CreatedBy,
				"created_at":     task.CreatedAt,
				"updated_at":     task.UpdatedAt,
				"completed_at":   task.CompletedAt,
			})
		}
		json.NewEncoder(w).Encode(tasks)
	}
}

func completeTaskHandler(useCase input.CompleteTaskUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(r.URL.Path, "/")
		taskIDStr := parts[len(parts)-1]

		taskID, err := uuid.Parse(taskIDStr)
		if err != nil {
			http.Error(w, "Invalid task ID", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), input.CompleteTaskInput{
			TaskID: taskID,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"task_id": result.TaskID,
			"status":  string(result.Status),
		})
	}
}

func updateTaskStatusHandler(useCase input.UpdateTaskStatusUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost && r.Method != http.MethodPatch {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(r.URL.Path, "/")
		taskIDStr := parts[len(parts)-1]

		taskID, err := uuid.Parse(taskIDStr)
		if err != nil {
			http.Error(w, "Invalid task ID", http.StatusBadRequest)
			return
		}

		var req struct {
			Status entities.TaskStatus `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), input.UpdateTaskStatusInput{
			TaskID: taskID,
			Status: req.Status,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"task_id": result.TaskID,
			"status":  string(result.Status),
		})
	}
}

func deleteTaskHandler(useCase input.DeleteTaskUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete && r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(r.URL.Path, "/")
		taskIDStr := parts[len(parts)-1]

		taskID, err := uuid.Parse(taskIDStr)
		if err != nil {
			http.Error(w, "Invalid task ID", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), input.DeleteTaskInput{
			TaskID: taskID,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"task_id": result.TaskID,
		})
	}
}

func createScheduleHandler(useCase input.CreateScheduleUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var req struct {
			TaskID    string            `json:"task_id"`
			CleanerID string            `json:"cleaner_id"`
			Date      string            `json:"date"`
			TimeSlot  entities.TimeSlot `json:"time_slot"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		taskID, err := uuid.Parse(req.TaskID)
		if err != nil {
			http.Error(w, "Invalid task_id", http.StatusBadRequest)
			return
		}

		cleanerID, err := uuid.Parse(req.CleanerID)
		if err != nil {
			http.Error(w, "Invalid cleaner_id", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), input.CreateScheduleInput{
			TaskID:    taskID,
			CleanerID: cleanerID,
			Date:      req.Date,
			TimeSlot:  req.TimeSlot,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id": result.ID,
		})
	}
}

func listSchedulesHandler(useCase input.ListSchedulesUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		taskID := r.URL.Query().Get("task_id")
		cleanerID := r.URL.Query().Get("cleaner_id")
		active := r.URL.Query().Get("active")

		var taskIDParsed *uuid.UUID
		var cleanerIDParsed *uuid.UUID
		var activeParsed *bool

		if taskID != "" {
			id, err := uuid.Parse(taskID)
			if err != nil {
				http.Error(w, "Invalid task_id", http.StatusBadRequest)
				return
			}
			taskIDParsed = &id
		}

		if cleanerID != "" {
			id, err := uuid.Parse(cleanerID)
			if err != nil {
				http.Error(w, "Invalid cleaner_id", http.StatusBadRequest)
				return
			}
			cleanerIDParsed = &id
		}

		if active != "" {
			parsed, err := strconv.ParseBool(active)
			if err != nil {
				http.Error(w, "Invalid active value", http.StatusBadRequest)
				return
			}
			activeParsed = &parsed
		}

		result, err := useCase.Execute(r.Context(), input.ListSchedulesInput{
			TaskID:    taskIDParsed,
			CleanerID: cleanerIDParsed,
			Active:    activeParsed,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		schedules := make([]map[string]interface{}, 0, len(result.Schedules))
		for _, s := range result.Schedules {
			schedules = append(schedules, map[string]interface{}{
				"id":         s.ID,
				"task_id":    s.TaskID,
				"cleaner_id": s.CleanerID,
				"date":       s.Date,
				"time_slot":  string(s.TimeSlot),
				"active":     s.Active,
				"created_at": s.CreatedAt,
				"updated_at": s.UpdatedAt,
			})
		}
		json.NewEncoder(w).Encode(schedules)
	}
}

func updateScheduleHandler(useCase input.UpdateScheduleUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPatch {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(r.URL.Path, "/")
		scheduleIDStr := parts[len(parts)-1]

		scheduleID, err := uuid.Parse(scheduleIDStr)
		if err != nil {
			http.Error(w, "Invalid schedule ID", http.StatusBadRequest)
			return
		}

		var req struct {
			TimeSlot entities.TimeSlot `json:"time_slot"`
			Active   *bool             `json:"active"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		var timeSlotParsed *entities.TimeSlot
		if req.TimeSlot != "" {
			timeSlotParsed = &req.TimeSlot
		}

		result, err := useCase.Execute(r.Context(), input.UpdateScheduleInput{
			ID:       scheduleID,
			TimeSlot: timeSlotParsed,
			Active:   req.Active,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":        result.ID,
			"time_slot": string(result.TimeSlot),
			"active":    result.Active,
		})
	}
}

func deleteScheduleHandler(useCase input.DeleteScheduleUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(r.URL.Path, "/")
		scheduleIDStr := parts[len(parts)-1]

		scheduleID, err := uuid.Parse(scheduleIDStr)
		if err != nil {
			http.Error(w, "Invalid schedule ID", http.StatusBadRequest)
			return
		}

		result, err := useCase.Execute(r.Context(), input.DeleteScheduleInput{
			ID: scheduleID,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id": result.ID,
		})
	}
}

func listUsersHandler(useCase input.ListUsersUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		claims := auth.GetClaimsFromContext(r.Context())
		if claims == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		role := r.URL.Query().Get("role")

		var roleParsed *entities.UserRole
		if role != "" {
			r := entities.UserRole(role)
			roleParsed = &r
		}

		result, err := useCase.Execute(r.Context(), input.ListUsersInput{
			Role: roleParsed,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		users := make([]map[string]interface{}, 0, len(result.Users))
		for _, user := range result.Users {
			users = append(users, map[string]interface{}{
				"id":        user.ID,
				"email":     user.Email,
				"full_name": user.FullName,
				"role":      string(user.Role),
			})
		}
		json.NewEncoder(w).Encode(users)
	}
}
