import {Link} from 'react-router-dom'

function LegalPage() {

  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-300 mb-8">Legal Information</h1>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">1. Legal Information</h3>
              <p className="text-gray-300">
                Ultra Times is a platform for publishing and selling digital content on the Ultra blockchain.
              </p>
              <p className="text-gray-300 mt-2">
                The website is published by Ultra Times SAS<br />
                Registered office: 123 Avenue de la République, 75011 Paris<br />
                SIRET: 123 456 789 00000<br />
                VAT: FR12345678900<br />
                Share capital: €10,000
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">2. Publication Director</h3>
              <p className="text-gray-300">
                The publication director is Mr. Jean Dupont, in his capacity as President of Ultra Times SAS.<br />
                Contact: contact@ultratimes.com
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">3. Hosting</h3>
              <p className="text-gray-300">
                The website is hosted by OVH SAS<br />
                2 rue Kellermann - 59100 Roubaix - France<br />
                SIRET: 424 761 419 00045
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">4. Personal Data Protection</h3>
              <p className="text-gray-300">
                Ultra Times SAS is the data controller for personal data collected on this website.<br />
                For any questions regarding the processing of your personal data, you can contact us at: privacy@ultratimes.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>
            Need help?{' '}
            <Link to="/contact" className="text-primary-300 hover:text-primary-400">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LegalPage 