export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      countries: {
        Row: {
          id: string;
          code: string;
          name: string;
          region: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['countries']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['countries']['Insert']>;
      };
      apps: {
        Row: {
          id: string;
          name: string;
          developer: string;
          category_id: string | null;
          description: string;
          icon_url: string;
          price: number;
          pricing_model: string;
          platform: string;
          play_store_url: string;
          app_store_url: string;
          rating: number;
          downloads: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['apps']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['apps']['Insert']>;
      };
      app_features: {
        Row: {
          id: string;
          app_id: string;
          privacy_score: number;
          performance_score: number;
          ease_of_use_score: number;
          feature_richness_score: number;
          customization_score: number;
          support_quality_score: number;
          ad_free: boolean;
          offline_mode: boolean;
          cross_platform: boolean;
          service_breadth_score: number;
          security_features: string[];
          unique_features: string[];
          limitations: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['app_features']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['app_features']['Insert']>;
      };
      app_availability: {
        Row: {
          id: string;
          app_id: string;
          country_id: string;
          available: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['app_availability']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['app_availability']['Insert']>;
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['service_categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['service_categories']['Insert']>;
      };
      app_services: {
        Row: {
          id: string;
          app_id: string;
          service_category_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['app_services']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['app_services']['Insert']>;
      };
    };
  };
}

export interface AppWithFeatures extends Database['public']['Tables']['apps']['Row'] {
  app_features: Database['public']['Tables']['app_features']['Row'][];
}
