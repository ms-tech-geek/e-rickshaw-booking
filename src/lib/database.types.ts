export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: number;
          name: string;
          mobile_number: string;
          pickup_location: string;
          booking_date: string;
          booking_time: string;
          status: string;
          assigned_driver: string | null;
          driver_contact: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
    };
  };
}