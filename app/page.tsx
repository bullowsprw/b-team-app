export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            B-Team App
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Bullows Infosystem for Employees
          </p>
          <p className="text-gray-500 mb-8">
            Vercel Web Analytics is now enabled and tracking visitors!
          </p>
          <div className="inline-block bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-700 mb-4">
              ✅ Vercel Web Analytics has been successfully integrated
            </p>
            <p className="text-sm text-gray-500">
              Your analytics data will be available in the Vercel Dashboard
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
