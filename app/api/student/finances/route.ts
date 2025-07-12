export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "all"

  const finances = {
    tuitionFees: {
      total: 12500,
      paid: 8000,
      due: 4500,
      dueDate: "2024-03-15",
    },
    hecs: {
      totalDebt: 45000,
      thisYearContribution: 12500,
    },
    textbooks: [
      { title: "Database System Concepts", cost: 180, purchased: true },
      { title: "Computer Networks: A Top-Down Approach", cost: 220, purchased: false },
    ],
  }

  if (category === "tuition") {
    return Response.json({ tuitionFees: finances.tuitionFees })
  } else if (category === "hecs") {
    return Response.json({ hecs: finances.hecs })
  } else if (category === "textbooks") {
    return Response.json({ textbooks: finances.textbooks })
  }

  return Response.json(finances)
}
