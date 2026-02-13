// Database types - will be generated from Supabase
// For now, placeholder types

export type DataCountry = 'SE' | 'NO' | 'DK'

export interface Database {
  public: {
    Tables: {
      // Identity Vault
      identities: {
        Row: {
          id: string
          supabase_auth_id: string | null
          role: 'patient' | 'staff' | 'admin'
          status: 'active' | 'inactive' | 'pending'
          data_country: DataCountry
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['identities']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['identities']['Insert']>
      }
      patient_identities: {
        Row: {
          id: string
          identity_id: string
          first_name_encrypted: string
          last_name_encrypted: string
          personal_number_encrypted: string
          personal_number_hash: string
          email_encrypted: string | null
          phone_encrypted: string | null
          country: DataCountry
          language: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['patient_identities']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['patient_identities']['Insert']>
      }
      // Clinical CDR
      clinical_subjects: {
        Row: {
          id: string
          age: number
          gender: 'male' | 'female' | 'other' | 'unknown'
          country: DataCountry
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clinical_subjects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clinical_subjects']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
