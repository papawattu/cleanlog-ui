package handler

import (
	"cleanlog/internal/application/usecase"
	"encoding/json"
	"net/http"
)

type ScheduleHandler struct {
	assignTaskUseCase     *usecase.AssignTaskUseCase
	createScheduleUseCase *usecase.CreateScheduleUseCase
}

func NewScheduleHandler(assignTaskUseCase *usecase.AssignTaskUseCase, createScheduleUseCase *usecase.CreateScheduleUseCase) *ScheduleHandler {
	return &ScheduleHandler{
		assignTaskUseCase:     assignTaskUseCase,
		createScheduleUseCase: createScheduleUseCase,
	}
}

func (h *ScheduleHandler) AssignTask(w http.ResponseWriter, r *http.Request) {
	var input usecase.AssignTaskInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	task, err := h.assignTaskUseCase.Execute(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":        task.ID,
		"title":     task.Title,
		"cleanerId": task.CleanerID,
		"status":    task.Status,
	})
}

func (h *ScheduleHandler) Create(w http.ResponseWriter, r *http.Request) {
	var input usecase.CreateScheduleInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	schedule, err := h.createScheduleUseCase.Execute(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":     schedule.ID,
		"taskId": schedule.TaskID,
		"date":   schedule.Date,
	})
}
