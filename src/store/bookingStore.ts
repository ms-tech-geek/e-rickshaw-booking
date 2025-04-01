import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchBookings: (page: number) => Promise<void>;
  createBooking: (booking: Database['public']['Tables']['bookings']['Insert']) => Promise<void>;
  updateBooking: (id: number, data: Database['public']['Tables']['bookings']['Update']) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  fetchBookings: async (page: number) => {
    try {
      set({ loading: true, error: null });
      const pageSize = 10;
      const from = (page - 1) * pageSize;
      const to = from + (pageSize - 1);

      // Get data with count
      const { data, count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: false })
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data) {
        throw new Error('No data received from the database');
      }

      set({
        bookings: data,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / pageSize),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  createBooking: async (booking) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.from('bookings').insert([booking]);
      if (error) throw error;
      await get().fetchBookings(1);
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateBooking: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('bookings')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      await get().fetchBookings(get().currentPage);
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));