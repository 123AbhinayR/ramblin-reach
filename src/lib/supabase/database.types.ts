
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {

  "public": {
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
                },"connection_requests": {
                  Row: {
                    "completed_at": string | null,"created_at": string,"format": Database["public"]['Enums']["request_format"],"goal_context": string,"goal_id": string | null,"help_topic": Database["public"]['Enums']["help_topic"],"id": string,"idempotency_key": string,"prior_effort": string | null,"recipient_id": string,"requester_id": string,"responded_at": string | null,"safe_project_url": string | null,"specific_question": string,"status": Database["public"]['Enums']["request_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string | null,"created_at"?: string,"format": Database["public"]['Enums']["request_format"],"goal_context": string,"goal_id"?: string | null,"help_topic": Database["public"]['Enums']["help_topic"],"id"?: string,"idempotency_key": string,"prior_effort"?: string | null,"recipient_id": string,"requester_id": string,"responded_at"?: string | null,"safe_project_url"?: string | null,"specific_question": string,"status"?: Database["public"]['Enums']["request_status"]
                  }
                  Update: {
                    "completed_at"?: string | null,"created_at"?: string,"format"?: Database["public"]['Enums']["request_format"],"goal_context"?: string,"goal_id"?: string | null,"help_topic"?: Database["public"]['Enums']["help_topic"],"id"?: string,"idempotency_key"?: string,"prior_effort"?: string | null,"recipient_id"?: string,"requester_id"?: string,"responded_at"?: string | null,"safe_project_url"?: string | null,"specific_question"?: string,"status"?: Database["public"]['Enums']["request_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "connection_requests_goal_id_fkey"
      columns: ["goal_id"]
isOneToOne: false
      referencedRelation: "goals"
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
                    "created_at": string,"id": string,"is_demo": boolean,"one_lesson": string | null,"owner_id": string,"resource_tags": (string)[],"safe_project_url": string | null,"skills": (string)[],"summary": string,"title": string,"updated_at": string,"visibility": Database["public"]['Enums']["project_visibility"]
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"is_demo"?: boolean,"one_lesson"?: string | null,"owner_id": string,"resource_tags"?: (string)[],"safe_project_url"?: string | null,"skills"?: (string)[],"summary": string,"title": string,"updated_at"?: string,"visibility"?: Database["public"]['Enums']["project_visibility"]
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"is_demo"?: boolean,"one_lesson"?: string | null,"owner_id"?: string,"resource_tags"?: (string)[],"safe_project_url"?: string | null,"skills"?: (string)[],"summary"?: string,"title"?: string,"updated_at"?: string,"visibility"?: Database["public"]['Enums']["project_visibility"]
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
                },"outcomes": {
                  Row: {
                    "created_at": string,"id": string,"outcome_type": Database["public"]['Enums']["outcome_type"],"private_note": string | null,"public_lesson": string | null,"reported_by": string,"request_id": string,"share_lesson": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"outcome_type": Database["public"]['Enums']["outcome_type"],"private_note"?: string | null,"public_lesson"?: string | null,"reported_by": string,"request_id": string,"share_lesson"?: boolean
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"outcome_type"?: Database["public"]['Enums']["outcome_type"],"private_note"?: string | null,"public_lesson"?: string | null,"reported_by"?: string,"request_id"?: string,"share_lesson"?: boolean
                  }
                  Relationships: [
                    {
      foreignKeyName: "outcomes_reported_by_fkey"
      columns: ["reported_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "outcomes_request_id_fkey"
      columns: ["request_id"]
isOneToOne: true
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
                    "affiliation": Database["public"]['Enums']["affiliation"],"bio": string | null,"company_name": string | null,"created_at": string,"display_name": string,"grad_year": number | null,"gt_topics": (string)[],"help_topics": (Database["public"]['Enums']["help_topic"])[],"id": string,"is_demo": boolean,"major": string | null,"metro": string | null,"monthly_cap": number,"paused": boolean,"role_title": string | null,"skills": (string)[],"updated_at": string,"verification_method": Database["public"]['Enums']["verification_method"],"verification_state": Database["public"]['Enums']["verification_state"],"verified_at": string | null,"visible": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "affiliation"?: Database["public"]['Enums']["affiliation"],"bio"?: string | null,"company_name"?: string | null,"created_at"?: string,"display_name"?: string,"grad_year"?: number | null,"gt_topics"?: (string)[],"help_topics"?: (Database["public"]['Enums']["help_topic"])[],"id": string,"is_demo"?: boolean,"major"?: string | null,"metro"?: string | null,"monthly_cap"?: number,"paused"?: boolean,"role_title"?: string | null,"skills"?: (string)[],"updated_at"?: string,"verification_method"?: Database["public"]['Enums']["verification_method"],"verification_state"?: Database["public"]['Enums']["verification_state"],"verified_at"?: string | null,"visible"?: boolean
                  }
                  Update: {
                    "affiliation"?: Database["public"]['Enums']["affiliation"],"bio"?: string | null,"company_name"?: string | null,"created_at"?: string,"display_name"?: string,"grad_year"?: number | null,"gt_topics"?: (string)[],"help_topics"?: (Database["public"]['Enums']["help_topic"])[],"id"?: string,"is_demo"?: boolean,"major"?: string | null,"metro"?: string | null,"monthly_cap"?: number,"paused"?: boolean,"role_title"?: string | null,"skills"?: (string)[],"updated_at"?: string,"verification_method"?: Database["public"]['Enums']["verification_method"],"verification_state"?: Database["public"]['Enums']["verification_state"],"verified_at"?: string | null,"visible"?: boolean
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
            "consume_rate_limit":
{ Args: { "p_operation": string }; Returns: boolean
                           },
"create_connection_request":
{ Args: { "p_format": Database["public"]['Enums']["request_format"],"p_goal_context": string,"p_goal_id": string,"p_help_topic": Database["public"]['Enums']["help_topic"],"p_idempotency_key": string,"p_prior_effort": string,"p_recipient_id": string,"p_safe_project_url": string,"p_specific_question": string }; Returns: {
              "completed_at": string | null,
"created_at": string,
"format": Database["public"]['Enums']["request_format"],
"goal_context": string,
"goal_id": string | null,
"help_topic": Database["public"]['Enums']["help_topic"],
"id": string,
"idempotency_key": string,
"prior_effort": string | null,
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
{ Args: { "p_goal_text": string,"p_intent": Database["public"]['Enums']["goal_intent"],"p_steps": Json,"p_tags": (string)[],"p_target_company": string,"p_target_metro": string }; Returns: string
                           },
"is_eligible_member":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"member_capacity":
{ Args: { "p_ids": (string)[] }; Returns: {
              "id": string,"used": number
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
      } }
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
  "public": {
          Enums: {
            "affiliation": ["student", "alumni"],"goal_intent": ["project", "career", "relocation"],"help_topic": ["project_guidance", "resource_navigation", "career_advice", "company_insight", "relocation_advice"],"outcome_type": ["resource_accessed", "technical_advice", "company_insight", "relocation_advice", "next_step_planned", "other"],"project_visibility": ["private", "members"],"request_format": ["chat_15min", "written_advice", "project_feedback"],"request_status": ["pending", "accepted", "declined", "cancelled", "completed"],"resource_kind": ["makerspace", "program", "funding", "community", "career", "regional"],"source_status": ["reviewed", "needs_review"],"step_kind": ["action", "resource", "find_person"],"step_status": ["not_started", "done"],"verification_method": ["email_control", "manual", "approved_integration", "demo"],"verification_state": ["pending", "verified", "demo"]
          }
        }
} as const
