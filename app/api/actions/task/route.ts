export async function POST(request: Request) {
  try {
    const { action, task, taskId, priority } = await request.json()

    if (!action) {
      return Response.json({ error: "Action is required" }, { status: 400 })
    }

    switch (action) {
      case "create":
        if (!task) {
          return Response.json({ error: "Task description is required for create action" }, { status: 400 })
        }
        const newTaskId = `task_${Date.now()}`
        return Response.json({
          success: true,
          message: `Created task "${task}" with ID: ${newTaskId}`,
          data: {
            id: newTaskId,
            task,
            priority: priority || "medium",
            created: new Date().toISOString(),
            status: "created",
          },
        })

      case "list":
        return Response.json({
          success: true,
          message: "Current tasks retrieved",
          data: {
            tasks: [
              { id: "task_1", task: "Review project proposal", priority: "high", status: "pending" },
              { id: "task_2", task: "Schedule team meeting", priority: "medium", status: "pending" },
              { id: "task_3", task: "Update documentation", priority: "low", status: "completed" },
            ],
          },
        })

      case "complete":
        if (!taskId) {
          return Response.json({ error: "Task ID is required for complete action" }, { status: 400 })
        }
        return Response.json({
          success: true,
          message: `Completed task ${taskId}`,
          data: { taskId, status: "completed", completedAt: new Date().toISOString() },
        })

      case "update":
        if (!taskId || !task) {
          return Response.json(
            { error: "Task ID and task description are required for update action" },
            { status: 400 },
          )
        }
        return Response.json({
          success: true,
          message: `Updated task ${taskId}: ${task}`,
          data: { taskId, task, updatedAt: new Date().toISOString() },
        })

      default:
        return Response.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Task API error:", error)
    return Response.json({ error: "Failed to manage task" }, { status: 500 })
  }
}
