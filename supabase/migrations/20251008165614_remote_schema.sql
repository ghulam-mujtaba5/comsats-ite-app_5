

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."is_admin"("uid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = uid
  );
$$;


ALTER FUNCTION "public"."is_admin"("uid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "role" character varying(50) DEFAULT 'admin'::character varying,
    "permissions" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "admin_users_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['admin'::character varying, 'super_admin'::character varying])::"text"[])))
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_cards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "description" "text",
    "link_url" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'published'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."community_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category" "text" DEFAULT 'General'::"text",
    "members" integer DEFAULT 0,
    "posts" integer DEFAULT 0,
    "recent_activity" "text",
    "is_joined" boolean DEFAULT false
);


ALTER TABLE "public"."community_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text",
    "content" "text" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "type" "text" DEFAULT 'general'::"text" NOT NULL,
    "likes" integer DEFAULT 0 NOT NULL,
    "comments" integer DEFAULT 0 NOT NULL,
    "shares" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "comments_count" integer DEFAULT 0
);


ALTER TABLE "public"."community_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_replies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "author_name" "text",
    "avatar_url" "text",
    "likes" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."community_replies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid",
    "user_id" "uuid",
    "student_name" character varying(255) NOT NULL,
    "student_id" character varying(50) NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."event_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "event_date" "date" NOT NULL,
    "event_time" time without time zone NOT NULL,
    "location" character varying(255) NOT NULL,
    "category" character varying(50) NOT NULL,
    "organizer" character varying(255) NOT NULL,
    "capacity" integer,
    "registration_open" boolean DEFAULT true,
    "image_url" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "events_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['academic'::character varying, 'social'::character varying, 'sports'::character varying, 'cultural'::character varying, 'workshop'::character varying])::"text"[])))
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faculty" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "title" "text",
    "department" "text",
    "email" "text",
    "office" "text",
    "phone" "text",
    "specialization" "text"[] DEFAULT '{}'::"text"[],
    "courses" "text"[] DEFAULT '{}'::"text"[],
    "education" "text"[] DEFAULT '{}'::"text"[],
    "experience" "text",
    "profile_image" "text",
    "rating_avg" numeric(3,2) DEFAULT 0,
    "rating_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."faculty" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faq_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" character varying(500) NOT NULL,
    "answer" "text" NOT NULL,
    "category" character varying(50) NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "is_published" boolean DEFAULT true,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."faq_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guidance_content" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" character varying(50) NOT NULL,
    "is_important" boolean DEFAULT false,
    "is_published" boolean DEFAULT true,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "guidance_content_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['academic'::character varying, 'admission'::character varying, 'campus'::character varying, 'financial'::character varying, 'policies'::character varying])::"text"[])))
);


ALTER TABLE "public"."guidance_content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."help_desk_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ticket_id" "uuid",
    "message" "text" NOT NULL,
    "author_name" character varying(255) NOT NULL,
    "author_role" character varying(50) NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "help_desk_responses_author_role_check" CHECK ((("author_role")::"text" = ANY ((ARRAY['student'::character varying, 'admin'::character varying])::"text"[])))
);


ALTER TABLE "public"."help_desk_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."help_desk_tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "category" character varying(100) NOT NULL,
    "priority" character varying(20) DEFAULT 'medium'::character varying,
    "status" character varying(50) DEFAULT 'open'::character varying,
    "student_name" character varying(255) NOT NULL,
    "student_id" character varying(50) NOT NULL,
    "user_id" "uuid",
    "assigned_to" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "help_desk_tickets_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::"text"[]))),
    CONSTRAINT "help_desk_tickets_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['open'::character varying, 'in-progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::"text"[])))
);


ALTER TABLE "public"."help_desk_tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."issue_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text" DEFAULT 'General'::"text" NOT NULL,
    "email" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "issue_reports_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'in_progress'::"text", 'resolved'::"text"])))
);


ALTER TABLE "public"."issue_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lost_found_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "category" character varying(50) NOT NULL,
    "item_type" character varying(100) NOT NULL,
    "location" character varying(255) NOT NULL,
    "contact_info" character varying(255) NOT NULL,
    "status" character varying(50) DEFAULT 'active'::character varying,
    "image_url" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "lost_found_items_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['lost'::character varying, 'found'::character varying])::"text"[]))),
    CONSTRAINT "lost_found_items_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'resolved'::character varying, 'closed'::character varying])::"text"[])))
);


ALTER TABLE "public"."lost_found_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "category" character varying(50) NOT NULL,
    "is_important" boolean DEFAULT false,
    "image_url" "text",
    "author_id" "uuid",
    "published_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "news_items_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['academic'::character varying, 'campus'::character varying, 'announcement'::character varying, 'achievement'::character varying])::"text"[])))
);


ALTER TABLE "public"."news_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."past_papers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "course_code" "text",
    "exam_type" "text",
    "semester" "text",
    "year" integer,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "download_url" "text",
    "file_url" "text",
    "department" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."past_papers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_likes" (
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."post_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "department" "text",
    "term" "text",
    "external_url" "text",
    "file_url" "text",
    "size_bytes" bigint,
    "mime_type" "text",
    "storage_path" "text",
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."resources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "faculty_id" "uuid" NOT NULL,
    "student_name" "text",
    "course" "text" NOT NULL,
    "semester" "text" NOT NULL,
    "rating" integer NOT NULL,
    "teaching_quality" integer NOT NULL,
    "accessibility" integer NOT NULL,
    "course_material" integer NOT NULL,
    "grading" integer NOT NULL,
    "comment" "text" NOT NULL,
    "pros" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "cons" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "would_recommend" boolean DEFAULT false NOT NULL,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    "helpful" integer DEFAULT 0 NOT NULL,
    "reported" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'approved'::"text" NOT NULL,
    CONSTRAINT "reviews_accessibility_check" CHECK ((("accessibility" >= 1) AND ("accessibility" <= 5))),
    CONSTRAINT "reviews_course_material_check" CHECK ((("course_material" >= 1) AND ("course_material" <= 5))),
    CONSTRAINT "reviews_grading_check" CHECK ((("grading" >= 1) AND ("grading" <= 5))),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "reviews_teaching_quality_check" CHECK ((("teaching_quality" >= 1) AND ("teaching_quality" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "site_name" character varying(255) DEFAULT 'COMSATS ITE App'::character varying,
    "site_description" "text" DEFAULT 'Student portal for COMSATS University'::"text",
    "site_logo_url" "text",
    "contact_email" character varying(255) DEFAULT 'admin@comsats.edu.pk'::character varying,
    "maintenance_mode" boolean DEFAULT false,
    "registration_enabled" boolean DEFAULT true,
    "max_file_size_mb" integer DEFAULT 10,
    "allowed_file_types" "text"[] DEFAULT ARRAY['pdf'::"text", 'doc'::"text", 'docx'::"text", 'jpg'::"text", 'png'::"text"],
    "theme_color" character varying(7) DEFAULT '#3b82f6'::character varying,
    "announcement_text" "text",
    "announcement_enabled" boolean DEFAULT false,
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255),
    "email" character varying(255),
    "category" character varying(50) NOT NULL,
    "message" "text" NOT NULL,
    "is_anonymous" boolean DEFAULT false,
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "user_id" "uuid",
    "assigned_to" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "support_requests_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'in-progress'::character varying, 'resolved'::character varying])::"text"[])))
);


ALTER TABLE "public"."support_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "category" character varying(50) NOT NULL,
    "contact_info" character varying(500) NOT NULL,
    "availability" character varying(255) NOT NULL,
    "is_emergency" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "support_resources_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['mental-health'::character varying, 'academic'::character varying, 'financial'::character varying, 'career'::character varying, 'personal'::character varying])::"text"[])))
);


ALTER TABLE "public"."support_resources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."test" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."test" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timetable" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_code" character varying(50) NOT NULL,
    "course_title" character varying(255) NOT NULL,
    "section" character varying(20) NOT NULL,
    "day" character varying(20) NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "room" character varying(50),
    "teacher_name" character varying(255),
    "department" character varying(100),
    "semester" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."timetable" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timetable_docs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "department" "text" NOT NULL,
    "term" "text" NOT NULL,
    "size_bytes" bigint NOT NULL,
    "mime_type" "text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "public_url" "text" NOT NULL,
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."timetable_docs" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."community_cards"
    ADD CONSTRAINT "community_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_groups"
    ADD CONSTRAINT "community_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_replies"
    ADD CONSTRAINT "community_replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faculty"
    ADD CONSTRAINT "faculty_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faq_items"
    ADD CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guidance_content"
    ADD CONSTRAINT "guidance_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."help_desk_responses"
    ADD CONSTRAINT "help_desk_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."help_desk_tickets"
    ADD CONSTRAINT "help_desk_tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."issue_reports"
    ADD CONSTRAINT "issue_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lost_found_items"
    ADD CONSTRAINT "lost_found_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_items"
    ADD CONSTRAINT "news_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."past_papers"
    ADD CONSTRAINT "past_papers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_pkey" PRIMARY KEY ("post_id", "user_id");



ALTER TABLE ONLY "public"."resources"
    ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_requests"
    ADD CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_resources"
    ADD CONSTRAINT "support_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."test"
    ADD CONSTRAINT "test_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timetable_docs"
    ADD CONSTRAINT "timetable_docs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timetable"
    ADD CONSTRAINT "timetable_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_events_category" ON "public"."events" USING "btree" ("category");



CREATE INDEX "idx_events_date" ON "public"."events" USING "btree" ("event_date");



CREATE INDEX "idx_faq_category" ON "public"."faq_items" USING "btree" ("category");



CREATE INDEX "idx_guidance_category" ON "public"."guidance_content" USING "btree" ("category");



CREATE INDEX "idx_help_desk_created_at" ON "public"."help_desk_tickets" USING "btree" ("created_at");



CREATE INDEX "idx_help_desk_priority" ON "public"."help_desk_tickets" USING "btree" ("priority");



CREATE INDEX "idx_help_desk_status" ON "public"."help_desk_tickets" USING "btree" ("status");



CREATE INDEX "idx_lost_found_category" ON "public"."lost_found_items" USING "btree" ("category");



CREATE INDEX "idx_lost_found_created_at" ON "public"."lost_found_items" USING "btree" ("created_at");



CREATE INDEX "idx_lost_found_status" ON "public"."lost_found_items" USING "btree" ("status");



CREATE INDEX "idx_news_category" ON "public"."news_items" USING "btree" ("category");



CREATE INDEX "idx_news_published_at" ON "public"."news_items" USING "btree" ("published_at");



CREATE INDEX "idx_papers_course" ON "public"."past_papers" USING "btree" ("course_code");



CREATE INDEX "idx_papers_created_at" ON "public"."past_papers" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_papers_semester" ON "public"."past_papers" USING "btree" ("semester");



CREATE INDEX "idx_papers_status" ON "public"."past_papers" USING "btree" ("status");



CREATE INDEX "idx_papers_year" ON "public"."past_papers" USING "btree" ("year");



CREATE INDEX "idx_reviews_faculty_status" ON "public"."reviews" USING "btree" ("faculty_id", "status");



CREATE INDEX "idx_reviews_status" ON "public"."reviews" USING "btree" ("status");



CREATE INDEX "idx_support_requests_status" ON "public"."support_requests" USING "btree" ("status");



CREATE INDEX "idx_support_resources_category" ON "public"."support_resources" USING "btree" ("category");



CREATE INDEX "idx_timetable_created_at" ON "public"."timetable" USING "btree" ("created_at");



CREATE INDEX "idx_timetable_department" ON "public"."timetable" USING "btree" ("department");



CREATE INDEX "idx_timetable_docs_department" ON "public"."timetable_docs" USING "btree" ("department");



CREATE INDEX "idx_timetable_docs_term" ON "public"."timetable_docs" USING "btree" ("term");



CREATE INDEX "idx_timetable_docs_uploaded_at" ON "public"."timetable_docs" USING "btree" ("uploaded_at");



CREATE INDEX "idx_timetable_semester" ON "public"."timetable" USING "btree" ("semester");



CREATE INDEX "ix_community_cards_sort" ON "public"."community_cards" USING "btree" ("sort_order");



CREATE INDEX "ix_community_cards_status" ON "public"."community_cards" USING "btree" ("status");



CREATE INDEX "ix_event_registrations_event_id" ON "public"."event_registrations" USING "btree" ("event_id");



CREATE INDEX "ix_events_category" ON "public"."events" USING "btree" ("category");



CREATE INDEX "ix_events_event_date" ON "public"."events" USING "btree" ("event_date");



CREATE INDEX "ix_news_items_category" ON "public"."news_items" USING "btree" ("category");



CREATE INDEX "ix_news_items_published_at" ON "public"."news_items" USING "btree" ("published_at" DESC);



CREATE OR REPLACE TRIGGER "trg_events_set_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_news_items_set_updated_at" BEFORE UPDATE ON "public"."news_items" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_timetable_docs_updated_at" BEFORE UPDATE ON "public"."timetable_docs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_timetable_updated_at" BEFORE UPDATE ON "public"."timetable" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_faq_items_updated_at" BEFORE UPDATE ON "public"."faq_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_guidance_content_updated_at" BEFORE UPDATE ON "public"."guidance_content" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_help_desk_tickets_updated_at" BEFORE UPDATE ON "public"."help_desk_tickets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_lost_found_items_updated_at" BEFORE UPDATE ON "public"."lost_found_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_news_items_updated_at" BEFORE UPDATE ON "public"."news_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_settings_updated_at" BEFORE UPDATE ON "public"."site_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_support_requests_updated_at" BEFORE UPDATE ON "public"."support_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_support_resources_updated_at" BEFORE UPDATE ON "public"."support_resources" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."community_replies"
    ADD CONSTRAINT "community_replies_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."faq_items"
    ADD CONSTRAINT "faq_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guidance_content"
    ADD CONSTRAINT "guidance_content_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."help_desk_responses"
    ADD CONSTRAINT "help_desk_responses_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."help_desk_tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."help_desk_responses"
    ADD CONSTRAINT "help_desk_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."help_desk_tickets"
    ADD CONSTRAINT "help_desk_tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."help_desk_tickets"
    ADD CONSTRAINT "help_desk_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lost_found_items"
    ADD CONSTRAINT "lost_found_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."news_items"
    ADD CONSTRAINT "news_items_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_likes"
    ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."support_requests"
    ADD CONSTRAINT "support_requests_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."support_requests"
    ADD CONSTRAINT "support_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."support_resources"
    ADD CONSTRAINT "support_resources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage FAQs" ON "public"."faq_items" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can manage events" ON "public"."events" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can manage guidance content" ON "public"."guidance_content" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can manage news" ON "public"."news_items" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can manage support requests" ON "public"."support_requests" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can manage support resources" ON "public"."support_resources" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins have full access" ON "public"."lost_found_items" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins have full access to responses" ON "public"."help_desk_responses" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Admins have full access to tickets" ON "public"."help_desk_tickets" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users"
  WHERE ("admin_users"."user_id" = "auth"."uid"()))));



CREATE POLICY "Allow anon read on test" ON "public"."test" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Anyone can read timetable" ON "public"."timetable" FOR SELECT USING (true);



CREATE POLICY "Anyone can read timetable docs" ON "public"."timetable_docs" FOR SELECT USING (true);



CREATE POLICY "Anyone can view active support resources" ON "public"."support_resources" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view events" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Anyone can view published FAQs" ON "public"."faq_items" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Anyone can view published guidance" ON "public"."guidance_content" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Anyone can view published news" ON "public"."news_items" FOR SELECT USING (true);



CREATE POLICY "Service role can manage timetable" ON "public"."timetable" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage timetable docs" ON "public"."timetable_docs" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can create responses" ON "public"."help_desk_responses" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create support requests" ON "public"."support_requests" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") OR ("is_anonymous" = true)));



CREATE POLICY "Users can create tickets" ON "public"."help_desk_tickets" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can register for events" ON "public"."event_registrations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own tickets" ON "public"."help_desk_tickets" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view responses to their tickets" ON "public"."help_desk_responses" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."help_desk_tickets"
  WHERE (("help_desk_tickets"."id" = "help_desk_responses"."ticket_id") AND ("help_desk_tickets"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own requests" ON "public"."support_requests" FOR SELECT USING ((("auth"."uid"() = "user_id") AND ("is_anonymous" = false)));



CREATE POLICY "Users can view their own tickets" ON "public"."help_desk_tickets" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their registrations" ON "public"."event_registrations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "admin moderate reviews" ON "public"."reviews" FOR UPDATE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR (("auth"."jwt"() ->> 'role'::"text") = 'super_admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR (("auth"."jwt"() ->> 'role'::"text") = 'super_admin'::"text")));



ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_users_self_read" ON "public"."admin_users" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."community_cards" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "community_cards_public_read" ON "public"."community_cards" FOR SELECT USING (("status" = 'published'::"text"));



ALTER TABLE "public"."community_groups" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "community_groups_select_public" ON "public"."community_groups" FOR SELECT USING (true);



ALTER TABLE "public"."community_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "community_posts_insert_authed" ON "public"."community_posts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "community_posts_select_public" ON "public"."community_posts" FOR SELECT USING (true);



CREATE POLICY "community_posts_update_own" ON "public"."community_posts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."community_replies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_registrations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_registrations_public_read" ON "public"."event_registrations" FOR SELECT USING (true);



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "events_admin_write" ON "public"."events" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."user_id" = "auth"."uid"())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."user_id" = "auth"."uid"()))));



CREATE POLICY "events_public_read" ON "public"."events" FOR SELECT USING (true);



ALTER TABLE "public"."faculty" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "faculty_public_read" ON "public"."faculty" FOR SELECT USING (true);



ALTER TABLE "public"."faq_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guidance_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."help_desk_responses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."help_desk_tickets" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert via service role only (reviews)" ON "public"."reviews" FOR INSERT TO "service_role" WITH CHECK (true);



ALTER TABLE "public"."lost_found_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "lost_found_items_anon_read_active" ON "public"."lost_found_items" FOR SELECT TO "anon" USING ((("status")::"text" = 'active'::"text"));



CREATE POLICY "lost_found_items_auth_delete_own" ON "public"."lost_found_items" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "lost_found_items_auth_insert_own" ON "public"."lost_found_items" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "lost_found_items_auth_read_own_or_active" ON "public"."lost_found_items" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (("status")::"text" = 'active'::"text")));



CREATE POLICY "lost_found_items_auth_update_own" ON "public"."lost_found_items" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."news_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "news_items_admin_write" ON "public"."news_items" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."user_id" = "auth"."uid"())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."user_id" = "auth"."uid"()))));



CREATE POLICY "news_items_anon_read" ON "public"."news_items" FOR SELECT TO "anon" USING (true);



CREATE POLICY "news_items_public_read" ON "public"."news_items" FOR SELECT USING (true);



CREATE POLICY "posts_delete_own" ON "public"."community_posts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "posts_insert_auth" ON "public"."community_posts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "posts_public_read" ON "public"."community_posts" FOR SELECT USING (true);



CREATE POLICY "posts_update_own" ON "public"."community_posts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "public read approved reviews" ON "public"."reviews" FOR SELECT TO "authenticated", "anon" USING (("status" = 'approved'::"text"));



CREATE POLICY "public read faculty" ON "public"."faculty" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "read own admin row" ON "public"."admin_users" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "read_published_community_cards" ON "public"."community_cards" FOR SELECT TO "anon" USING (("status" = 'published'::"text"));



ALTER TABLE "public"."resources" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "resources_select_public" ON "public"."resources" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reviews_delete_own" ON "public"."reviews" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "reviews_insert_auth" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "reviews_public_read" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "reviews_update_own" ON "public"."reviews" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."support_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."support_resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."test" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."timetable" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."timetable_docs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "timetable_docs_select_public" ON "public"."timetable_docs" FOR SELECT TO "authenticated", "anon" USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."community_cards" TO "anon";
GRANT ALL ON TABLE "public"."community_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."community_cards" TO "service_role";



GRANT ALL ON TABLE "public"."community_groups" TO "anon";
GRANT ALL ON TABLE "public"."community_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."community_groups" TO "service_role";



GRANT ALL ON TABLE "public"."community_posts" TO "anon";
GRANT ALL ON TABLE "public"."community_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."community_posts" TO "service_role";



GRANT ALL ON TABLE "public"."community_replies" TO "anon";
GRANT ALL ON TABLE "public"."community_replies" TO "authenticated";
GRANT ALL ON TABLE "public"."community_replies" TO "service_role";



GRANT ALL ON TABLE "public"."event_registrations" TO "anon";
GRANT ALL ON TABLE "public"."event_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."event_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."faculty" TO "anon";
GRANT ALL ON TABLE "public"."faculty" TO "authenticated";
GRANT ALL ON TABLE "public"."faculty" TO "service_role";



GRANT ALL ON TABLE "public"."faq_items" TO "anon";
GRANT ALL ON TABLE "public"."faq_items" TO "authenticated";
GRANT ALL ON TABLE "public"."faq_items" TO "service_role";



GRANT ALL ON TABLE "public"."guidance_content" TO "anon";
GRANT ALL ON TABLE "public"."guidance_content" TO "authenticated";
GRANT ALL ON TABLE "public"."guidance_content" TO "service_role";



GRANT ALL ON TABLE "public"."help_desk_responses" TO "anon";
GRANT ALL ON TABLE "public"."help_desk_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."help_desk_responses" TO "service_role";



GRANT ALL ON TABLE "public"."help_desk_tickets" TO "anon";
GRANT ALL ON TABLE "public"."help_desk_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."help_desk_tickets" TO "service_role";



GRANT ALL ON TABLE "public"."issue_reports" TO "anon";
GRANT ALL ON TABLE "public"."issue_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."issue_reports" TO "service_role";



GRANT ALL ON TABLE "public"."lost_found_items" TO "anon";
GRANT ALL ON TABLE "public"."lost_found_items" TO "authenticated";
GRANT ALL ON TABLE "public"."lost_found_items" TO "service_role";



GRANT ALL ON TABLE "public"."news_items" TO "anon";
GRANT ALL ON TABLE "public"."news_items" TO "authenticated";
GRANT ALL ON TABLE "public"."news_items" TO "service_role";



GRANT ALL ON TABLE "public"."past_papers" TO "anon";
GRANT ALL ON TABLE "public"."past_papers" TO "authenticated";
GRANT ALL ON TABLE "public"."past_papers" TO "service_role";



GRANT ALL ON TABLE "public"."post_likes" TO "anon";
GRANT ALL ON TABLE "public"."post_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."post_likes" TO "service_role";



GRANT ALL ON TABLE "public"."resources" TO "anon";
GRANT ALL ON TABLE "public"."resources" TO "authenticated";
GRANT ALL ON TABLE "public"."resources" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."support_requests" TO "anon";
GRANT ALL ON TABLE "public"."support_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."support_requests" TO "service_role";



GRANT ALL ON TABLE "public"."support_resources" TO "anon";
GRANT ALL ON TABLE "public"."support_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."support_resources" TO "service_role";



GRANT ALL ON TABLE "public"."test" TO "anon";
GRANT ALL ON TABLE "public"."test" TO "authenticated";
GRANT ALL ON TABLE "public"."test" TO "service_role";



GRANT ALL ON TABLE "public"."timetable" TO "anon";
GRANT ALL ON TABLE "public"."timetable" TO "authenticated";
GRANT ALL ON TABLE "public"."timetable" TO "service_role";



GRANT ALL ON TABLE "public"."timetable_docs" TO "anon";
GRANT ALL ON TABLE "public"."timetable_docs" TO "authenticated";
GRANT ALL ON TABLE "public"."timetable_docs" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;

  create policy "Public read timetable bucket"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'timetable'::text));



