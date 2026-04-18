package sqlite

import (
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed migrations
var migrationsFS embed.FS

type Db interface {
	Query(query string, args ...interface{}) (*sql.Rows, error)
	QueryRow(query string, args ...interface{}) *sql.Row
	Exec(query string, args ...interface{}) (sql.Result, error)
}

func NewMigrationProvider(db *sql.DB, dsn string) *MigrationProvider {
	return &MigrationProvider{db: db, dsn: dsn}
}

type MigrationProvider struct {
	db  *sql.DB
	dsn string
}

func (m *MigrationProvider) Migrate() error {
	migrationSQL, err := migrationsFS.ReadFile("migrations/000001_initial_migration.up.sql")
	if err != nil {
		return fmt.Errorf("failed to read migration file: %w", err)
	}

	statements := splitStatements(string(migrationSQL))
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		_, err := m.db.Exec(stmt)
		if err != nil {
			return fmt.Errorf("failed to execute migration statement: %w", err)
		}
	}

	return nil
}

func splitStatements(sql string) []string {
	var statements []string
	var current strings.Builder
	inQuote := false
	quoteChar := rune(0)

	for _, r := range sql {
		if (r == '\'' || r == '"') && (len(current.String()) == 0 || current.String()[len(current.String())-1] != '\\') {
			if !inQuote {
				inQuote = true
				quoteChar = r
			} else if r == quoteChar {
				inQuote = false
			}
		}
		if r == ';' && !inQuote {
			statements = append(statements, current.String())
			current.Reset()
		} else {
			current.WriteRune(r)
		}
	}

	last := strings.TrimSpace(current.String())
	if last != "" {
		statements = append(statements, last)
	}

	return statements
}

func ParseUUID(s string) (uuid.UUID, error) {
	if s == "" {
		return uuid.Nil, errors.New("empty UUID string")
	}
	return uuid.Parse(s)
}

func FormatUUID(u uuid.UUID) string {
	return u.String()
}

func ConvertTime(t time.Time) interface{} {
	return t
}
