package handler

import (
	"cleanlog/internal/application/usecase"
	"encoding/json"
	"net/http"
)

type OwnerTaskHandler struct {
	createTaskUseCase    *usecase.CreateTaskUseCase
	getOwnerTasksUseCase *usecase.GetOwnerTasksUseCase
}

func NewOwnerTaskHandler(createTaskUseCase *usecase.CreateTaskUseCase, getOwnerTasksUseCase *usecase.GetOwnerTasksUseCase) *OwnerTaskHandler {
	return &OwnerTaskHandler{
		createTaskUseCase:    createTaskUseCase,
		getOwnerTasksUseCase: getOwnerTasksUseCase,
	}
}

func (h *OwnerTaskHandler) Create(w http.ResponseWriter, r *http.Request) {
	var input usecase.CreateTaskInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	task, err := h.createTaskUseCase.Execute(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":          task.ID,
		"title":       task.Title,
		"description": task.Description,
		"type":        task.Type,
		"status":      task.Status,
		"scheduledAt": task.ScheduledAt,
		"ownerId":     task.OwnerID,
		"cleanerId":   task.CleanerID,
	})
}

func (h *OwnerTaskHandler) List(w http.ResponseWriter, r *http.Request) {
	ownerID := r.URL.Query().Get("owner_id")
	if ownerID == "" {
		http.Error(w, "owner_id is required", http.StatusBadRequest)
		return
	}

	tasks, err := h.getOwnerTasksUseCase.Execute(usecase.GetOwnerTasksInput{
		OwnerID: ownerID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}
