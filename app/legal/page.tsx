export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Legal Information</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Service</h2>
            <p className="text-gray-600">
              This University Student Assistant is provided as a demonstration tool for educational purposes. By using
              this service, you agree to use it responsibly and understand that all data is simulated for demo purposes
              only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
            <p className="text-gray-600">
              This demo uses mock student data and does not collect, store, or process any real personal information.
              All interactions are simulated and no actual student records are accessed or modified.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Educational Use</h2>
            <p className="text-gray-600">
              This tool is designed for educational demonstrations to show how AI agents can access and manage private
              institutional data. It showcases the potential of AI agents beyond public API integrations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              For questions about this demo, please contact: support@university-assistant.edu.au
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
