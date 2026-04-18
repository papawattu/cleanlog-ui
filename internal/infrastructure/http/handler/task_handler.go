package handler

import (
	"cleanlog/internal/application/usecase"
	"encoding/json"
	"net/http"
	"strings"
)

type TaskHandler struct {
	getCleanerTasksUseCase *usecase.GetCleanerTasksUseCase
	completeTaskUseCase    *usecase.CompleteTaskUseCase
}

func NewTaskHandler(getCleanerTasksUseCase *usecase.GetCleanerTasksUseCase, completeTaskUseCase *usecase.CompleteTaskUseCase) *TaskHandler {
	return &TaskHandler{
		getCleanerTasksUseCase: getCleanerTasksUseCase,
		completeTaskUseCase:    completeTaskUseCase,
	}
}

func (h *TaskHandler) ListCleanerTasks(w http.ResponseWriter, r *http.Request) {
	cleanerID := r.URL.Query().Get("cleaner_id")
	if cleanerID == "" {
		http.Error(w, "cleaner_id is required", http.StatusBadRequest)
		return
	}

	tasks, err := h.getCleanerTasksUseCase.Execute(usecase.GetCleanerTasksInput{
		CleanerID: cleanerID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func (h *TaskHandler) CompleteTask(w http.ResponseWriter, r *http.Request) {
	taskID := strings.TrimPrefix(r.URL.Path, "/api/tasks/")
	taskID = strings.TrimSuffix(taskID, "/complete")
	if taskID == "" {
		http.Error(w, "task id is required", http.StatusBadRequest)
		return
	}

	task, err := h.completeTaskUseCase.Execute(usecase.CompleteTaskInput{
		TaskID: taskID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}
