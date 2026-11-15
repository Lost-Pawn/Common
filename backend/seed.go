package main

import (
	"context"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"os"
	"strings"
)

func (a *App) seed(ctx context.Context) error {
	tx, e := a.db.Begin(ctx)
	if e != nil {
		return e
	}
	defer tx.Rollback(ctx)
	if _, e = tx.Exec(ctx, "SELECT pg_advisory_xact_lock(740282)"); e != nil {
		return e
	}
	for _, d := range helpCorpus {
		if _, e = tx.Exec(ctx, "INSERT INTO help_docs(title,body) VALUES($1,$2) ON CONFLICT(title) DO UPDATE SET body=excluded.body", d.Title, d.Body); e != nil {
			return e
		}
	}
	if email, password := os.Getenv("ADMIN_EMAIL"), os.Getenv("ADMIN_PASSWORD"); email != "" && password != "" {
		if len(password) < 12 || len(password) > 72 {
			return fmt.Errorf("ADMIN_PASSWORD must contain 12 to 72 characters")
		}
		var exists bool
		if e = tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", strings.ToLower(email)).Scan(&exists); e != nil {
			return e
		}
		if !exists {
			h, _ := bcrypt.GenerateFromPassword([]byte(password), 12)
			if _, e = tx.Exec(ctx, "INSERT INTO users(name,email,password_hash,role,verified) VALUES('Community administrator',$1,$2,'admin',true)", strings.ToLower(email), string(h)); e != nil {
				return e
			}
		}
	}
	if os.Getenv("DEMO_SEED") == "true" && !a.production {
		h, e := bcrypt.GenerateFromPassword([]byte("CommonDemo2026!"), 10)
		if e != nil {
			return e
		}
		demo := []struct {
			name, email, role, business string
			verified                    bool
			qual                        []string
		}{{"Meera Desai", "manager@common.test", "manager", "Common Community", true, []string{}}, {"Asha Patil", "asha@common.test", "borrower", "Pune", true, []string{"camera"}}, {"Ravi Shah", "ravi@common.test", "borrower", "Pune", true, []string{"camera", "power_tools"}}, {"Community Administrator", "admin@common.test", "admin", "Common Community", true, []string{}}, {"Resource Owner", "owner@common.test", "owner", "Neighbourhood collection", true, []string{}}}
		for _, d := range demo {
			if _, e = tx.Exec(ctx, "INSERT INTO users(name,email,password_hash,role,business,verified,qualifications) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(email) DO UPDATE SET qualifications=ARRAY(SELECT DISTINCT q FROM unnest(users.qualifications || excluded.qualifications) AS q)", d.name, d.email, string(h), d.role, d.business, d.verified, d.qual); e != nil {
				return e
			}
		}
		// One-time local demo credential refresh after the product rename.
		var renamed bool
		if e = tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version='common_demo_credentials')").Scan(&renamed); e != nil {
			return e
		}
		if !renamed {
			if _, e = tx.Exec(ctx, "UPDATE users SET password_hash=$1 WHERE email=ANY($2)", string(h), []string{"asha@common.test", "ravi@common.test", "manager@common.test", "owner@common.test", "admin@common.test"}); e != nil {
				return e
			}
			if _, e = tx.Exec(ctx, "INSERT INTO schema_migrations(version) VALUES('common_demo_credentials')"); e != nil {
				return e
			}
		}
		var n int
		_ = tx.QueryRow(ctx, "SELECT count(*) FROM resources").Scan(&n)
		{
			var owner int64
			if e = tx.QueryRow(ctx, "SELECT id FROM users WHERE email='manager@common.test'").Scan(&owner); e != nil {
				return e
			}
			seed := []struct {
				name, cat, desc, training, policy string
				rate                              int
			}{{"Workshop drill kit", "tools", "A precision drill and bit set for your next home project. Assistance is available for first-time users.", "power_tools", "optional", 40},
				{"Studio camera kit", "creative", "A mirrorless camera, portrait lens and tripod for a day of making. Includes a short resource orientation.", "camera", "optional", 120},
				{"Community worktable", "spaces", "A bright, spacious table for study groups, craft afternoons and collaborative projects.", "", "none", 0},
				{"A weekend outdoors", "outdoors", "A two-person tent with a groundsheet and carry bag. Air it out and return it dry after your adventure.", "", "none", 10},
				{"The neighbourhood bookshelf", "books", "A rotating collection of fiction, design and practical guides. Pick a few and pass the stories along.", "", "none", 0},
				{"Movie night projector", "electronics", "A portable full-HD projector with HDMI cable and remote. All you need is a blank wall.", "", "none", 35},
				{"For a table of twelve", "home", "Reusable dinner plates, bowls and serving dishes for a small gathering. Return the complete set clean.", "", "none", 0}}

			for _, d := range seed {
				if _, e = tx.Exec(ctx, `INSERT INTO resources(owner_id,name,category,description,location,rules,training,operator_policy,hourly_rate,deposit,open_hour,close_hour,max_hours,weekly_hours) SELECT $1,$2,$3,$4,'Koregaon Park, Pune','Agree on collection with the owner. Record condition at handover. Return all parts clean and on time.',$5,$6,$7,0,CASE WHEN $6='none' THEN 0 ELSE 8 END,CASE WHEN $6='none' THEN 24 ELSE 20 END,CASE WHEN $6='none' THEN 168 ELSE 4 END,168 WHERE NOT EXISTS (SELECT 1 FROM resources WHERE owner_id=$1 AND name=$2)`, owner, d.name, d.cat, d.desc, d.training, d.policy, d.rate); e != nil {
					return e
				}
			}
		}
		// Existing local demos keep their old qualifications and gain the new resource examples.
		for _, o := range []struct {
			name        string
			quals       []string
			open, close int
		}{
			{"Sunita More", []string{"power_tools", "camera"}, 8, 20},
			{"Farah Shaikh", []string{"camera"}, 9, 18},
		} {
			tag, err := tx.Exec(ctx, "UPDATE operators SET qualifications=ARRAY(SELECT DISTINCT q FROM unnest(qualifications || $2::text[]) AS q) WHERE name=$1", o.name, o.quals)
			if err != nil {
				return err
			}
			if tag.RowsAffected() == 0 {
				if _, err = tx.Exec(ctx, "INSERT INTO operators(name,qualifications,open_hour,close_hour) VALUES($1,$2,$3,$4)", o.name, o.quals, o.open, o.close); err != nil {
					return err
				}
			}
		}
	}
	return tx.Commit(ctx)
}
