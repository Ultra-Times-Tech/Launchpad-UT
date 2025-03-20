import {Link} from 'react-router-dom'

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-300 mb-8">Privacy Policy</h1>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">1. Personal Data Collection</h3>
              <p className="text-gray-300">
                Ultra Times collects the following personal data:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Ultra wallet address</li>
                <li>Navigation data (cookies)</li>
                <li>Transaction history</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">2. Data Usage</h3>
              <p className="text-gray-300">
                Your personal data is used for:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>Managing your user account</li>
                <li>Processing your transactions</li>
                <li>Sending you information about our services</li>
                <li>Improving our website and services</li>
                <li>Complying with our legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">3. Data Protection</h3>
              <p className="text-gray-300">
                We implement appropriate security measures to protect your personal data against unauthorized access, modification, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">4. Data Retention</h3>
              <p className="text-gray-300">
                Your data is retained for the duration of your registration and for 3 years after account closure, in accordance with our legal obligations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">5. Your Rights</h3>
              <p className="text-gray-300">
                Under GDPR, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>Right to access your data</li>
                <li>Right to rectification</li>
                <li>Right to erasure</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">6. Cookies Policy</h3>
              <p className="text-gray-300">
                A cookie is a small text file stored on your computer or mobile device when visiting a website. It allows us to recognize you on subsequent visits and remember your preferences.
              </p>
              <p className="text-gray-300 mt-2">
                We use the following types of cookies:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>Essential cookies: necessary for website functionality</li>
                <li>Performance cookies: to analyze website usage</li>
                <li>Functionality cookies: to remember your preferences</li>
                <li>Targeting cookies: to offer personalized content</li>
              </ul>
              <p className="text-gray-300 mt-2">
                Cookies are stored for a maximum period of 13 months after being placed on your device. After this period, we will ask for your consent to reuse them.
              </p>
              <p className="text-gray-300 mt-2">
                You can at any time:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>Accept or refuse cookies through our consent banner</li>
                <li>Configure your browser to refuse cookies</li>
                <li>Delete cookies already installed on your device</li>
              </ul>
              <p className="text-gray-300 mt-2">
                Refusing to install cookies may prevent access to certain features of the site. Essential cookies cannot be refused as they are necessary for the website to function.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">7. Contact</h3>
              <p className="text-gray-300">
                For any questions regarding the processing of your personal data or our cookie policy, you can contact us at: privacy@ultratimes.com
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

export default PrivacyPolicyPage