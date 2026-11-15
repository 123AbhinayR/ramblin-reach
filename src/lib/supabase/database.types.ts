
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {

  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
"set_available_now":{Args:{p_enabled:boolean};Returns:string|null},
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "blocks": {
                  Row: {
                    "blocked_id": string,"blocker_id": string,"created_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "blocked_id": string,"blocker_id": string,"created_at"?: string
                  }
                  Update: {
                    "blocked_id"?: string,"blocker_id"?: string,"created_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "blocks_blocked_id_fkey"
      columns: ["blocked_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocker_id_fkey"
      columns: ["blocker_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"circle_comments": {
                  Row: {
                    "body": string,"created_at": string,"id": string,"owner_id": string,"parent_id": string | null,"post_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"created_at"?: string,"id"?: string,"owner_id"?: string,"parent_id"?: string | null,"post_id": string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"id"?: string,"owner_id"?: string,"parent_id"?: string | null,"post_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "circle_comments_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "circle_comments_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "circle_comments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "circle_comments_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "circle_posts"
      referencedColumns: ["id"]
    }
                  ]
                },"circle_posts": {
                  Row: {
                    "category": string,"created_at": string,"description": string,"github_url": string | null,"id": string,"kind": string,"owner_id": string,"project_id": string | null,"project_url": string | null,"resolved": boolean,"specific_request": string,"tags": (string)[],"team_size": number | null,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category": string,"created_at"?: string,"description": string,"github_url"?: string | null,"id"?: string,"kind": string,"owner_id"?: string,"project_id"?: string | null,"project_url"?: string | null,"resolved"?: boolean,"specific_request": string,"tags"?: (string)[],"team_size"?: number | null,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "category"?: string,"created_at"?: string,"description"?: string,"github_url"?: string | null,"id"?: string,"kind"?: string,"owner_id"?: string,"project_id"?: string | null,"project_url"?: string | null,"resolved"?: boolean,"specific_request"?: string,"tags"?: (string)[],"team_size"?: number | null,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "circle_posts_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "circle_posts_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "member_projects"
      referencedColumns: ["id"]
    }
                  ]
                },"circle_reports": {
                  Row: {
                    "created_at": string,"id": string,"post_id": string,"reason": string,"reporter_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"post_id": string,"reason": string,"reporter_id"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"post_id"?: string,"reason"?: string,"reporter_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "circle_reports_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "circle_posts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "circle_reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"connection_requests": {
                  Row: {
                    "completed_at": string | null,"created_at": string,"format": Database["public"]['Enums']["request_format"],"goal_context": string,"goal_id": string | null,"help_topic": Database["public"]['Enums']["help_topic"],"id": string,"idempotency_key": string,"prior_effort": string | null,"project_id": string | null,"recipient_id": string,"requester_id": string,"responded_at": string | null,"safe_project_url": string | null,"specific_question": string,"status": Database["public"]['Enums']["request_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string | null,"created_at"?: string,"format": Database["public"]['Enums']["request_format"],"goal_context": string,"goal_id"?: string | null,"help_topic": Database["public"]['Enums']["help_topic"],"id"?: string,"idempotency_key": string,"prior_effort"?: string | null,"project_id"?: string | null,"recipient_id": string,"requester_id": string,"responded_at"?: string | null,"safe_project_url"?: string | null,"specific_question": string,"status"?: Database["public"]['Enums']["request_status"]
                  }
                  Update: {
                    "completed_at"?: string | null,"created_at"?: string,"format"?: Database["public"]['Enums']["request_format"],"goal_context"?: string,"goal_id"?: string | null,"help_topic"?: Database["public"]['Enums']["help_topic"],"id"?: string,"idempotency_key"?: string,"prior_effort"?: string | null,"project_id"?: string | null,"recipient_id"?: string,"requester_id"?: string,"responded_at"?: string | null,"safe_project_url"?: string | null,"specific_question"?: string,"status"?: Database["public"]['Enums']["request_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "connection_requests_goal_id_fkey"
      columns: ["goal_id"]
isOneToOne: false
      referencedRelation: "goals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "connection_requests_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "member_projects"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "connection_requests_recipient_id_fkey"
      columns: ["recipient_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "connection_requests_requester_id_fkey"
      columns: ["requester_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"goals": {
                  Row: {
                    "created_at": string,"extracted_tags": (string)[],"goal_text": string,"id": string,"intent": Database["public"]['Enums']["goal_intent"],"owner_id": string,"target_company": string | null,"target_metro": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"extracted_tags"?: (string)[],"goal_text": string,"id"?: string,"intent": Database["public"]['Enums']["goal_intent"],"owner_id": string,"target_company"?: string | null,"target_metro"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"extracted_tags"?: (string)[],"goal_text"?: string,"id"?: string,"intent"?: Database["public"]['Enums']["goal_intent"],"owner_id"?: string,"target_company"?: string | null,"target_metro"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "goals_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"member_projects": {
                  Row: {
                    "category": string,"created_at": string,"current_challenge": string,"id": string,"is_demo": boolean,"one_lesson": string | null,"owner_id": string,"requested_help": string,"resource_tags": (string)[],"safe_project_url": string | null,"skills": (string)[],"summary": string,"title": string,"updated_at": string,"visibility": Database["public"]['Enums']["project_visibility"]
                  }
                  ComputedFields: never
                  Insert: {
                    "category"?: string,"created_at"?: string,"current_challenge"?: string,"id"?: string,"is_demo"?: boolean,"one_lesson"?: string | null,"owner_id": string,"requested_help"?: string,"resource_tags"?: (string)[],"safe_project_url"?: string | null,"skills"?: (string)[],"summary": string,"title": string,"updated_at"?: string,"visibility"?: Database["public"]['Enums']["project_visibility"]
                  }
                  Update: {
                    "category"?: string,"created_at"?: string,"current_challenge"?: string,"id"?: string,"is_demo"?: boolean,"one_lesson"?: string | null,"owner_id"?: string,"requested_help"?: string,"resource_tags"?: (string)[],"safe_project_url"?: string | null,"skills"?: (string)[],"summary"?: string,"title"?: string,"updated_at"?: string,"visibility"?: Database["public"]['Enums']["project_visibility"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "member_projects_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"membership_requests": {
                  Row: {
                    "created_at": string,"owner_id": string,"requested_affiliation": Database["public"]['Enums']["affiliation"]
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"owner_id": string,"requested_affiliation": Database["public"]['Enums']["affiliation"]
                  }
                  Update: {
                    "created_at"?: string,"owner_id"?: string,"requested_affiliation"?: Database["public"]['Enums']["affiliation"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "membership_requests_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "actor_id": string,"created_at": string,"dedupe_key": string,"id": string,"kind": string,"post_id": string | null,"read_at": string | null,"reason": string,"recipient_id": string,"request_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "actor_id": string,"created_at"?: string,"dedupe_key": string,"id"?: string,"kind": string,"post_id"?: string | null,"read_at"?: string | null,"reason"?: string,"recipient_id": string,"request_id"?: string | null
                  }
                  Update: {
                    "actor_id"?: string,"created_at"?: string,"dedupe_key"?: string,"id"?: string,"kind"?: string,"post_id"?: string | null,"read_at"?: string | null,"reason"?: string,"recipient_id"?: string,"request_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_post_id_fkey"
      columns: ["post_id"]
isOneToOne: false
      referencedRelation: "circle_posts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_recipient_id_fkey"
      columns: ["recipient_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_request_id_fkey"
      columns: ["request_id"]
isOneToOne: false
      referencedRelation: "connection_requests"
      referencedColumns: ["id"]
    }
                  ]
                },"outcomes": {
                  Row: {
                    "created_at": string,"helped": string,"id": string,"learned": string,"log_shared": boolean,"next_step": string,"outcome_type": Database["public"]['Enums']["outcome_type"],"private_note": string | null,"project_id": string | null,"public_lesson": string | null,"reported_by": string,"request_id": string,"share_lesson": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"helped"?: string,"id"?: string,"learned"?: string,"log_shared"?: boolean,"next_step"?: string,"outcome_type": Database["public"]['Enums']["outcome_type"],"private_note"?: string | null,"project_id"?: string | null,"public_lesson"?: string | null,"reported_by": string,"request_id": string,"share_lesson"?: boolean
                  }
                  Update: {
                    "created_at"?: string,"helped"?: string,"id"?: string,"learned"?: string,"log_shared"?: boolean,"next_step"?: string,"outcome_type"?: Database["public"]['Enums']["outcome_type"],"private_note"?: string | null,"project_id"?: string | null,"public_lesson"?: string | null,"reported_by"?: string,"request_id"?: string,"share_lesson"?: boolean
                  }
                  Relationships: [
                    {
      foreignKeyName: "outcomes_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "member_projects"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "outcomes_reported_by_fkey"
      columns: ["reported_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "outcomes_request_id_fkey"
      columns: ["request_id"]
isOneToOne: false
      referencedRelation: "connection_requests"
      referencedColumns: ["id"]
    }
                  ]
                },"path_steps": {
                  Row: {
                    "completed_at": string | null,"created_at": string,"description": string,"goal_id": string,"id": string,"kind": Database["public"]['Enums']["step_kind"],"ordinal": number,"reason": string,"resource_id": string | null,"source_snapshot": Json | null,"status": Database["public"]['Enums']["step_status"],"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string | null,"created_at"?: string,"description": string,"goal_id": string,"id"?: string,"kind": Database["public"]['Enums']["step_kind"],"ordinal": number,"reason": string,"resource_id"?: string | null,"source_snapshot"?: Json | null,"status"?: Database["public"]['Enums']["step_status"],"title": string
                  }
                  Update: {
                    "completed_at"?: string | null,"created_at"?: string,"description"?: string,"goal_id"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["step_kind"],"ordinal"?: number,"reason"?: string,"resource_id"?: string | null,"source_snapshot"?: Json | null,"status"?: Database["public"]['Enums']["step_status"],"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "path_steps_goal_id_fkey"
      columns: ["goal_id"]
isOneToOne: false
      referencedRelation: "goals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "path_steps_resource_id_fkey"
      columns: ["resource_id"]
isOneToOne: false
      referencedRelation: "resources"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "available_until": string | null,
                    "built_at_tech": Json | null,
                    "affiliation": Database["public"]['Enums']["affiliation"],"bio": string | null,"can_teach": (string)[],"company_name": string | null,"created_at": string,"display_name": string,"grad_year": number | null,"gt_topics": (string)[],"help_topics": (Database["public"]['Enums']["help_topic"])[],"id": string,"interests": (string)[],"is_demo": boolean,"major": string | null,"mentor_categories": (string)[],"metro": string | null,"monthly_cap": number,"paused": boolean,"role_title": string | null,"skills": (string)[],"updated_at": string,"verification_method": Database["public"]['Enums']["verification_method"],"verification_state": Database["public"]['Enums']["verification_state"],"verified_at": string | null,"visible": boolean,"want_learn": (string)[]
                  }
                  ComputedFields: never
                  Insert: {
                    "available_until"?: string | null,
                    "built_at_tech"?: Json | null,
                    "affiliation"?: Database["public"]['Enums']["affiliation"],"bio"?: string | null,"can_teach"?: (string)[],"company_name"?: string | null,"created_at"?: string,"display_name"?: string,"grad_year"?: number | null,"gt_topics"?: (string)[],"help_topics"?: (Database["public"]['Enums']["help_topic"])[],"id": string,"interests"?: (string)[],"is_demo"?: boolean,"major"?: string | null,"mentor_categories"?: (string)[],"metro"?: string | null,"monthly_cap"?: number,"paused"?: boolean,"role_title"?: string | null,"skills"?: (string)[],"updated_at"?: string,"verification_method"?: Database["public"]['Enums']["verification_method"],"verification_state"?: Database["public"]['Enums']["verification_state"],"verified_at"?: string | null,"visible"?: boolean,"want_learn"?: (string)[]
                  }
                  Update: {
                    "available_until"?: string | null,
                    "built_at_tech"?: Json | null,
                    "affiliation"?: Database["public"]['Enums']["affiliation"],"bio"?: string | null,"can_teach"?: (string)[],"company_name"?: string | null,"created_at"?: string,"display_name"?: string,"grad_year"?: number | null,"gt_topics"?: (string)[],"help_topics"?: (Database["public"]['Enums']["help_topic"])[],"id"?: string,"interests"?: (string)[],"is_demo"?: boolean,"major"?: string | null,"mentor_categories"?: (string)[],"metro"?: string | null,"monthly_cap"?: number,"paused"?: boolean,"role_title"?: string | null,"skills"?: (string)[],"updated_at"?: string,"verification_method"?: Database["public"]['Enums']["verification_method"],"verification_state"?: Database["public"]['Enums']["verification_state"],"verified_at"?: string | null,"visible"?: boolean,"want_learn"?: (string)[]
                  }
                  Relationships: [

                  ]
                },"reports": {
                  Row: {
                    "created_at": string,"id": string,"reason": string,"reporter_id": string,"request_id": string | null,"target_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"reason": string,"reporter_id": string,"request_id"?: string | null,"target_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"reason"?: string,"reporter_id"?: string,"request_id"?: string | null,"target_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_request_id_fkey"
      columns: ["request_id"]
isOneToOne: false
      referencedRelation: "connection_requests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_target_id_fkey"
      columns: ["target_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"request_messages": {
                  Row: {
                    "body": string,"created_at": string,"id": number,"idempotency_key": string,"request_id": string,"sender_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"created_at"?: string,"id"?: never,"idempotency_key": string,"request_id": string,"sender_id": string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"id"?: never,"idempotency_key"?: string,"request_id"?: string,"sender_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "request_messages_request_id_fkey"
      columns: ["request_id"]
isOneToOne: false
      referencedRelation: "connection_requests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "request_messages_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"request_reads": {
                  Row: {
                    "last_message_id": number,"member_id": string,"request_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "last_message_id"?: number,"member_id": string,"request_id": string
                  }
                  Update: {
                    "last_message_id"?: number,"member_id"?: string,"request_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "request_reads_member_id_fkey"
      columns: ["member_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "request_reads_request_id_fkey"
      columns: ["request_id"]
isOneToOne: false
      referencedRelation: "connection_requests"
      referencedColumns: ["id"]
    }
                  ]
                },"resources": {
                  Row: {
                    "active": boolean,"claimed_live_availability": boolean,"display_priority": number,"eligibility_caveat": string,"eligible_audience": string,"id": string,"kind": Database["public"]['Enums']["resource_kind"],"last_reviewed_at": string,"official_domain": string,"official_url": string,"prerequisite_tags": (string)[],"short_description": string,"slug": string,"source_status": Database["public"]['Enums']["source_status"],"student_action": string,"tags": (string)[],"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"claimed_live_availability"?: boolean,"display_priority"?: number,"eligibility_caveat": string,"eligible_audience": string,"id"?: string,"kind": Database["public"]['Enums']["resource_kind"],"last_reviewed_at": string,"official_domain": string,"official_url": string,"prerequisite_tags"?: (string)[],"short_description": string,"slug": string,"source_status"?: Database["public"]['Enums']["source_status"],"student_action": string,"tags"?: (string)[],"title": string
                  }
                  Update: {
                    "active"?: boolean,"claimed_live_availability"?: boolean,"display_priority"?: number,"eligibility_caveat"?: string,"eligible_audience"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["resource_kind"],"last_reviewed_at"?: string,"official_domain"?: string,"official_url"?: string,"prerequisite_tags"?: (string)[],"short_description"?: string,"slug"?: string,"source_status"?: Database["public"]['Enums']["source_status"],"student_action"?: string,"tags"?: (string)[],"title"?: string
                  }
                  Relationships: [

                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
"set_available_now":{Args:{p_enabled:boolean};Returns:string|null},
            "consume_rate_limit":
{ Args: { "p_operation": string }; Returns: boolean
                           },
"create_connection_request":
{ Args: { "p_format": Database["public"]['Enums']["request_format"],"p_goal_context": string,"p_goal_id": string | null,"p_help_topic": Database["public"]['Enums']["help_topic"],"p_idempotency_key": string,"p_prior_effort": string | null,"p_recipient_id": string,"p_safe_project_url": string | null,"p_specific_question": string }; Returns: {
              "completed_at": string | null,
"created_at": string,
"format": Database["public"]['Enums']["request_format"],
"goal_context": string,
"goal_id": string | null,
"help_topic": Database["public"]['Enums']["help_topic"],
"id": string,
"idempotency_key": string,
"prior_effort": string | null,
"project_id": string | null,
"recipient_id": string,
"requester_id": string,
"responded_at": string | null,
"safe_project_url": string | null,
"specific_question": string,
"status": Database["public"]['Enums']["request_status"]
            }
                          SetofOptions: {
        from: "*"
        to: "connection_requests"
        isOneToOne: true
        isSetofReturn: false
      } },
"create_goal_with_path":
{ Args: { "p_goal_text": string,"p_intent": Database["public"]['Enums']["goal_intent"],"p_steps": Json,"p_tags": (string)[],"p_target_company": string | null,"p_target_metro": string | null }; Returns: string
                           },
"create_project_reachcard":
{ Args: { "p_input": Json,"p_project_id": string | null }; Returns: {
              "completed_at": string | null,
"created_at": string,
"format": Database["public"]['Enums']["request_format"],
"goal_context": string,
"goal_id": string | null,
"help_topic": Database["public"]['Enums']["help_topic"],
"id": string,
"idempotency_key": string,
"prior_effort": string | null,
"project_id": string | null,
"recipient_id": string,
"requester_id": string,
"responded_at": string | null,
"safe_project_url": string | null,
"specific_question": string,
"status": Database["public"]['Enums']["request_status"]
            }
                          SetofOptions: {
        from: "*"
        to: "connection_requests"
        isOneToOne: true
        isSetofReturn: false
      } },
"exchange_overlap":
{ Args: { "a": (string)[],"b": (string)[] }; Returns: (string)[]
                           },
"is_eligible_member":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"mark_request_read":
{ Args: { "p_last_id": number,"p_request_id": string }; Returns: undefined
                           },
"member_capacity":
{ Args: { "p_ids": (string)[] }; Returns: {
              "id": string,"used": number
            }[]
                           },
"send_request_message":
{ Args: { "p_body": string,"p_key": string,"p_request_id": string }; Returns: {
              "body": string,
"created_at": string,
"id": number,
"idempotency_key": string,
"request_id": string,
"sender_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "request_messages"
        isOneToOne: true
        isSetofReturn: false
      } },
"shared_learning_log":
{ Args: { "p_member_id": string | null,"p_project_id": string | null }; Returns: {
              "created_at": string,"helped": string,"id": string,"learned": string,"next_step": string,"project_id": string,"reported_by": string
            }[]
                           },
"transition_connection_request":
{ Args: { "p_action": string,"p_request_id": string }; Returns: {
              "completed_at": string | null,
"created_at": string,
"format": Database["public"]['Enums']["request_format"],
"goal_context": string,
"goal_id": string | null,
"help_topic": Database["public"]['Enums']["help_topic"],
"id": string,
"idempotency_key": string,
"prior_effort": string | null,
"project_id": string | null,
"recipient_id": string,
"requester_id": string,
"responded_at": string | null,
"safe_project_url": string | null,
"specific_question": string,
"status": Database["public"]['Enums']["request_status"]
            }
                          SetofOptions: {
        from: "*"
        to: "connection_requests"
        isOneToOne: true
        isSetofReturn: false
      } },
"unread_request_ids":
{ Args: { "p_ids": (string)[] }; Returns: {
              "request_id": string
            }[]
                           }
          }
          Enums: {
            "affiliation": "student"|"alumni","goal_intent": "project"|"career"|"relocation","help_topic": "project_guidance"|"resource_navigation"|"career_advice"|"company_insight"|"relocation_advice","outcome_type": "resource_accessed"|"technical_advice"|"company_insight"|"relocation_advice"|"next_step_planned"|"other","project_visibility": "private"|"members","request_format": "chat_15min"|"written_advice"|"project_feedback","request_status": "pending"|"accepted"|"declined"|"cancelled"|"completed","resource_kind": "makerspace"|"program"|"funding"|"community"|"career"|"regional","source_status": "reviewed"|"needs_review","step_kind": "action"|"resource"|"find_person","step_status": "not_started"|"done","verification_method": "email_control"|"manual"|"approved_integration"|"demo","verification_state": "pending"|"verified"|"demo"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {

          }
        },"public": {
          Enums: {
            "affiliation": ["student", "alumni"],"goal_intent": ["project", "career", "relocation"],"help_topic": ["project_guidance", "resource_navigation", "career_advice", "company_insight", "relocation_advice"],"outcome_type": ["resource_accessed", "technical_advice", "company_insight", "relocation_advice", "next_step_planned", "other"],"project_visibility": ["private", "members"],"request_format": ["chat_15min", "written_advice", "project_feedback"],"request_status": ["pending", "accepted", "declined", "cancelled", "completed"],"resource_kind": ["makerspace", "program", "funding", "community", "career", "regional"],"source_status": ["reviewed", "needs_review"],"step_kind": ["action", "resource", "find_person"],"step_status": ["not_started", "done"],"verification_method": ["email_control", "manual", "approved_integration", "demo"],"verification_state": ["pending", "verified", "demo"]
          }
        }
} as const
