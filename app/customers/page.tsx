import Link from "next/link"

export default function Customers() {
  const customers = [
    { id: 1, name: "Acme Corp" },
    { id: 2, name: "TechStart Inc" },
    { id: 3, name: "Global Services" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <ul className="space-y-2">
        {customers.map((customer) => (
          <li key={customer.id} className="p-2 border rounded">
            <Link href={`/customers/${customer.id}`}>{customer.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

