const mockBookings = [
  {
    id: "b1",
    facility: "Study Room 4A",
    date: "2024-02-21",
    time: "10:00-12:00",
    purpose: "Group project work",
    attendees: 4,
  },
]

export async function GET() {
  return Response.json({
    bookings: mockBookings,
    availableFacilities: [
      "Study Room 1A",
      "Study Room 2B",
      "Study Room 3C",
      "Computer Lab 1",
      "Group Discussion Room",
      "Quiet Study Pod 5",
    ],
  })
}

export async function POST(request: Request) {
  const { facility, date, timeSlot, purpose, attendees } = await request.json()

  if (!facility || !date || !timeSlot) {
    return Response.json({ error: "Facility, date, and time slot required" }, { status: 400 })
  }

  const newBooking = {
    id: `b${Date.now()}`,
    facility,
    date,
    time: timeSlot,
    purpose: purpose || "Study session",
    attendees: attendees || 1,
  }

  mockBookings.push(newBooking)

  return Response.json({
    success: true,
    message: `Booked ${facility} for ${new Date(date).toLocaleDateString("en-AU")} at ${timeSlot}`,
    booking: newBooking,
  })
}
