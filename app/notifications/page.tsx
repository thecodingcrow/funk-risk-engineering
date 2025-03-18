export default function Notifications() {
  const notifications = [
    { id: 1, message: "New submission for Case #1", date: "2023-06-01" },
    { id: 2, message: "Case #2 has been closed", date: "2023-05-30" },
    { id: 3, message: "New case assigned: #3", date: "2023-05-29" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li key={notification.id} className="p-2 border rounded">
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500">{notification.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

