export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_trails: {
        Row: {
          action: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          base_rate: number
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at: string | null
          emergency_surcharge: number | null
          end_time: string
          id: string
          is_emergency: boolean | null
          location: Json
          notes: string | null
          payment_intent_id: string | null
          payment_status: boolean | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          unit_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_rate: number
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at?: string | null
          emergency_surcharge?: number | null
          end_time: string
          id?: string
          is_emergency?: boolean | null
          location: Json
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: boolean | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_rate?: number
          booking_type?: Database["public"]["Enums"]["booking_type"]
          created_at?: string | null
          emergency_surcharge?: number | null
          end_time?: string
          id?: string
          is_emergency?: boolean | null
          location?: Json
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: boolean | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "surveillance_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at: string
          id: string
          logo: string | null
          name: string
          updated_at: string
        }
        Insert: {
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at?: string
          id?: string
          logo?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          message: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          message: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          message?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string
          duration: string
          end_date: string | null
          facilitator_id: string | null
          id: string
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          end_date?: string | null
          facilitator_id?: string | null
          id?: string
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          end_date?: string | null
          facilitator_id?: string | null
          id?: string
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_facilitator_id_fkey"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          bucket_id: string
          client_id: string | null
          course_id: string | null
          document_type: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
          student_id: string | null
          tags: string[] | null
          updated_at: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          bucket_id: string
          client_id?: string | null
          course_id?: string | null
          document_type: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
          student_id?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          bucket_id?: string
          client_id?: string | null
          course_id?: string | null
          document_type?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          storage_path?: string
          student_id?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      location_tracking: {
        Row: {
          accuracy: number | null
          address: string | null
          assessment_id: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          timestamp: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          address?: string | null
          assessment_id?: string | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          timestamp?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          address?: string | null
          assessment_id?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_tracking_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "vehicle_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "NEO AI": {
        Row: {
          "Booking ID": string | null
          "Client Name": string | null
          Contact: number | null
          "Contact on Site": number | null
          "Delivery Address": string | null
          "Distance (km)": string | null
          "Emergency Fee": string | null
          "End Date/Time": string | null
          "Monitoring Fee": string | null
          "Monitoring Option": string | null
          Origin: string | null
          "Responsible Person": string | null
          "Start Date/Time": string | null
          Status: string | null
          "Total Cost": string | null
          "Tracking Link": string | null
          "Travel Fee": string | null
          "Unit ID": string | null
        }
        Insert: {
          "Booking ID"?: string | null
          "Client Name"?: string | null
          Contact?: number | null
          "Contact on Site"?: number | null
          "Delivery Address"?: string | null
          "Distance (km)"?: string | null
          "Emergency Fee"?: string | null
          "End Date/Time"?: string | null
          "Monitoring Fee"?: string | null
          "Monitoring Option"?: string | null
          Origin?: string | null
          "Responsible Person"?: string | null
          "Start Date/Time"?: string | null
          Status?: string | null
          "Total Cost"?: string | null
          "Tracking Link"?: string | null
          "Travel Fee"?: string | null
          "Unit ID"?: string | null
        }
        Update: {
          "Booking ID"?: string | null
          "Client Name"?: string | null
          Contact?: number | null
          "Contact on Site"?: number | null
          "Delivery Address"?: string | null
          "Distance (km)"?: string | null
          "Emergency Fee"?: string | null
          "End Date/Time"?: string | null
          "Monitoring Fee"?: string | null
          "Monitoring Option"?: string | null
          Origin?: string | null
          "Responsible Person"?: string | null
          "Start Date/Time"?: string | null
          Status?: string | null
          "Total Cost"?: string | null
          "Tracking Link"?: string | null
          "Travel Fee"?: string | null
          "Unit ID"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "NEO AI_Booking ID_fkey"
            columns: ["Booking ID"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rates: {
        Row: {
          base_rate: number
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at: string | null
          emergency_surcharge: number | null
          id: string
          min_hours: number | null
          updated_at: string | null
        }
        Insert: {
          base_rate: number
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at?: string | null
          emergency_surcharge?: number | null
          id?: string
          min_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          base_rate?: number
          booking_type?: Database["public"]["Enums"]["booking_type"]
          created_at?: string | null
          emergency_surcharge?: number | null
          id?: string
          min_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          contact_number: string
          created_at: string
          email: string
          first_name: string
          id: string
          id_number: string
          last_name: string
          message: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          region: string
          status: string
        }
        Insert: {
          contact_number: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          id_number: string
          last_name: string
          message?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          region: string
          status?: string
        }
        Update: {
          contact_number?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          id_number?: string
          last_name?: string
          message?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          region?: string
          status?: string
        }
        Relationships: []
      }
      student_courses: {
        Row: {
          completion_date: string | null
          course_id: string | null
          enrollment_date: string
          id: string
          progress: Json | null
          student_id: string | null
        }
        Insert: {
          completion_date?: string | null
          course_id?: string | null
          enrollment_date?: string
          id?: string
          progress?: Json | null
          student_id?: string | null
        }
        Update: {
          completion_date?: string | null
          course_id?: string | null
          enrollment_date?: string
          id?: string
          progress?: Json | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_courses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar: string | null
          client_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          client_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          client_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      surveillance_units: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          last_maintenance_date: string | null
          name: string
          next_maintenance_date: string | null
          specifications: Json | null
          status: Database["public"]["Enums"]["unit_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          last_maintenance_date?: string | null
          name: string
          next_maintenance_date?: string | null
          specifications?: Json | null
          status?: Database["public"]["Enums"]["unit_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          last_maintenance_date?: string | null
          name?: string
          next_maintenance_date?: string | null
          specifications?: Json | null
          status?: Database["public"]["Enums"]["unit_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          contact_number: string
          created_at: string
          email: string
          first_name: string
          id: string
          id_number: string
          last_name: string
          region: string
          role: string
        }
        Insert: {
          contact_number: string
          created_at?: string
          email: string
          first_name: string
          id: string
          id_number: string
          last_name: string
          region: string
          role?: string
        }
        Update: {
          contact_number?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          id_number?: string
          last_name?: string
          region?: string
          role?: string
        }
        Relationships: []
      }
      vehicle_assessments: {
        Row: {
          assessment_notes: string
          assessor_id: string
          bank_details: Json
          created_at: string
          id: string
          inspection_location: Json | null
          photos: Json
          status: string
          updated_at: string
          vehicle_info: Json
        }
        Insert: {
          assessment_notes: string
          assessor_id: string
          bank_details: Json
          created_at?: string
          id?: string
          inspection_location?: Json | null
          photos?: Json
          status?: string
          updated_at?: string
          vehicle_info: Json
        }
        Update: {
          assessment_notes?: string
          assessor_id?: string
          bank_details?: Json
          created_at?: string
          id?: string
          inspection_location?: Json | null
          photos?: Json
          status?: string
          updated_at?: string
          vehicle_info?: Json
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "Zevoli p": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      booking_type: "events" | "schools" | "parking" | "emergency"
      unit_status: "available" | "deployed" | "maintenance" | "offline"
      user_role:
        | "client"
        | "admin"
        | "super_admin"
        | "facilitator"
        | "student"
        | "project_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      booking_type: ["events", "schools", "parking", "emergency"],
      unit_status: ["available", "deployed", "maintenance", "offline"],
      user_role: [
        "client",
        "admin",
        "super_admin",
        "facilitator",
        "student",
        "project_manager",
      ],
    },
  },
} as const
