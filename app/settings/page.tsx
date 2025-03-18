export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input type="text" id="name" className="p-2 border rounded w-full" />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input type="email" id="email" className="p-2 border rounded w-full" />
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  )
}

