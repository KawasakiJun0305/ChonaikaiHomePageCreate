export type NewsCategory = 'event' | 'news' | 'important' | 'garbage';
export type AdminRole = 'admin' | 'editor';
export type ContactStatus = 'unread' | 'read' | 'replied';
export type AuditAction = 'create' | 'update' | 'delete';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: AdminRole;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: AdminRole;
        };
        Update: {
          name?: string;
          role?: AdminRole;
        };
        Relationships: [];
      };
      news: {
        Row: {
          id: string;
          title: string;
          body: string;
          category: NewsCategory;
          published: boolean;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          body: string;
          category: NewsCategory;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
        };
        Update: {
          title?: string;
          body?: string;
          category?: NewsCategory;
          published?: boolean;
          published_at?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          location: string | null;
          published: boolean;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          event_date: string;
          description?: string | null;
          location?: string | null;
          published?: boolean;
          author_id?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          event_date?: string;
          location?: string | null;
          published?: boolean;
        };
        Relationships: [];
      };
      garbage_schedules: {
        Row: {
          id: string;
          month: number;
          year: number;
          garbage_type: string;
          days: number[];
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          month: number;
          year: number;
          garbage_type: string;
          days: number[];
          note?: string | null;
        };
        Update: {
          month?: number;
          year?: number;
          garbage_type?: string;
          days?: number[];
          note?: string | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: ContactStatus;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
        };
        Update: {
          status?: ContactStatus;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: AuditAction;
          table_name: string;
          record_id: string | null;
          diff: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          action: AuditAction;
          table_name: string;
          record_id?: string | null;
          diff?: Record<string, unknown> | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
