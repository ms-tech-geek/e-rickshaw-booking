import React, { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { format } from 'date-fns';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

export function AdminDashboard() {
  const { bookings, loading, error, currentPage, totalPages, fetchBookings, updateBooking } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const handleDriverAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const formData = new FormData(e.currentTarget);
    await updateBooking(selectedBooking.id, {
      assigned_driver: formData.get('driverName') as string,
      driver_contact: formData.get('driverContact') as string,
      status: formData.get('status') as string,
    });
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.mobile_number.includes(searchTerm);
    
    const bookingDate = new Date(booking.booking_date);
    const matchesDateRange = 
      (!dateRange.start || bookingDate >= new Date(dateRange.start)) &&
      (!dateRange.end || bookingDate <= new Date(dateRange.end));

    return matchesSearch && matchesDateRange;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or mobile"
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            className="border rounded-lg px-4 py-2"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          <input
            type="date"
            className="border rounded-lg px-4 py-2"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                  <div className="text-sm text-gray-500">{booking.mobile_number}</div>
                </td>
                <td className="px-6 py-4">{booking.pickup_location}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{format(new Date(booking.booking_date), 'PP')}</div>
                  <div className="text-sm text-gray-500">{booking.booking_time}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {booking.assigned_driver ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.assigned_driver}</div>
                      <div className="text-sm text-gray-500">{booking.driver_contact}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Assign Driver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchBookings(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchBookings(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Assign Driver</h3>
            <form onSubmit={handleDriverAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input
                  name="driverName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedBooking.assigned_driver || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Contact</label>
                <input
                  name="driverContact"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedBooking.driver_contact || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={selectedBooking.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}