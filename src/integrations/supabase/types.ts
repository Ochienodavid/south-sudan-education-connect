export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          duty_station: string | null
          email: string | null
          full_name: string
          id: string
          job_title: string | null
        }
        Insert: {
          created_at?: string
          duty_station?: string | null
          email?: string | null
          full_name?: string
          id: string
          job_title?: string | null
        }
        Update: {
          created_at?: string
          duty_station?: string | null
          email?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          accredited: boolean
          capacity: number
          code: string
          county: string | null
          created_at: string
          created_by: string | null
          email: string | null
          established_year: number | null
          head_teacher: string | null
          id: string
          latitude: number | null
          level: string
          longitude: number | null
          name: string
          notes: string | null
          ownership: string
          payam: string | null
          phone: string | null
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          accredited?: boolean
          capacity?: number
          code: string
          county?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          established_year?: number | null
          head_teacher?: string | null
          id?: string
          latitude?: number | null
          level?: string
          longitude?: number | null
          name: string
          notes?: string | null
          ownership?: string
          payam?: string | null
          phone?: string | null
          state?: string
          status?: string
          updated_at?: string
        }
        Update: {
          accredited?: boolean
          capacity?: number
          code?: string
          county?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          established_year?: number | null
          head_teacher?: string | null
          id?: string
          latitude?: number | null
          level?: string
          longitude?: number | null
          name?: string
          notes?: string | null
          ownership?: string
          payam?: string | null
          phone?: string | null
          state?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class_level: string
          code: string
          county_of_origin: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          disability: string
          enrollment_date: string
          first_name: string
          gender: string
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          last_name: string
          notes: string | null
          school_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          class_level?: string
          code: string
          county_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          disability?: string
          enrollment_date?: string
          first_name: string
          gender?: string
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          last_name: string
          notes?: string | null
          school_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          class_level?: string
          code?: string
          county_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          disability?: string
          enrollment_date?: string
          first_name?: string
          gender?: string
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          last_name?: string
          notes?: string | null
          school_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          employment_status: string
          first_name: string
          gender: string
          grade_level: string | null
          hire_date: string | null
          id: string
          last_name: string
          licence_expiry: string | null
          licence_number: string | null
          main_subject: string | null
          monthly_salary: number
          national_id: string | null
          phone: string | null
          qualification: string
          school_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          employment_status?: string
          first_name: string
          gender?: string
          grade_level?: string | null
          hire_date?: string | null
          id?: string
          last_name: string
          licence_expiry?: string | null
          licence_number?: string | null
          main_subject?: string | null
          monthly_salary?: number
          national_id?: string | null
          phone?: string | null
          qualification?: string
          school_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          employment_status?: string
          first_name?: string
          gender?: string
          grade_level?: string | null
          hire_date?: string | null
          id?: string
          last_name?: string
          licence_expiry?: string | null
          licence_number?: string | null
          main_subject?: string | null
          monthly_salary?: number
          national_id?: string | null
          phone?: string | null
          qualification?: string
          school_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      school_directory: {
        Row: {
          accredited: boolean | null
          code: string | null
          county: string | null
          id: string | null
          latitude: number | null
          level: string | null
          longitude: number | null
          name: string | null
          ownership: string | null
          payam: string | null
          state: string | null
        }
        Insert: {
          accredited?: boolean | null
          code?: string | null
          county?: string | null
          id?: string | null
          latitude?: number | null
          level?: string | null
          longitude?: number | null
          name?: string | null
          ownership?: string | null
          payam?: string | null
          state?: string | null
        }
        Update: {
          accredited?: boolean | null
          code?: string | null
          county?: string | null
          id?: string | null
          latitude?: number | null
          level?: string | null
          longitude?: number | null
          name?: string | null
          ownership?: string | null
          payam?: string | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_write: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "officer" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "officer", "viewer"],
    },
  },
} as const
