import React from 'react';
import { useForm } from 'react-hook-form';
import { format, addDays, parse, isAfter } from 'date-fns';
import { useBookingStore } from '../store/bookingStore';
import type { Database } from '../lib/database.types';

type BookingFormData = Database['public']['Tables']['bookings']['Insert'];

export function BookingForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>();
  const { createBooking, loading, error } = useBookingStore();

  const onSubmit = async (data: BookingFormData) => {
    await createBooking({
      ...data,
      status: 'Pending',
    });
    reset();
  };

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Book an E-Rickshaw</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Name must not exceed 50 characters' }
          })}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          type="tel"
          id="mobile_number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('mobile_number', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Please enter a valid 10-digit mobile number'
            }
          })}
        />
        {errors.mobile_number && <p className="mt-1 text-sm text-red-600">{errors.mobile_number.message}</p>}
      </div>

      <div>
        <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-700">Pickup Location</label>
        <textarea
          id="pickup_location"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('pickup_location', { required: 'Pickup location is required' })}
        />
        {errors.pickup_location && <p className="mt-1 text-sm text-red-600">{errors.pickup_location.message}</p>}
      </div>

      <div>
        <label htmlFor="booking_date" className="block text-sm font-medium text-gray-700">Booking Date</label>
        <input
          type="date"
          id="booking_date"
          min={minDate}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('booking_date', {
            required: 'Booking date is required',
            validate: value => 
              isAfter(parse(value, 'yyyy-MM-dd', new Date()), new Date()) || 
              'Please select a future date'
          })}
        />
        {errors.booking_date && <p className="mt-1 text-sm text-red-600">{errors.booking_date.message}</p>}
      </div>

      <div>
        <label htmlFor="booking_time" className="block text-sm font-medium text-gray-700">Booking Time</label>
        <input
          type="time"
          id="booking_time"
          step="900"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register('booking_time', { required: 'Booking time is required' })}
        />
        {errors.booking_time && <p className="mt-1 text-sm text-red-600">{errors.booking_time.message}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
}