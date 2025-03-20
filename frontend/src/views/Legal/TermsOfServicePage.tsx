import {Link} from 'react-router-dom'

function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-300 mb-8">Terms of Sale</h1>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">1. Introduction</h3>
              <p className="text-gray-300">
                These terms of sale apply to all transactions made on the Ultra Times platform. By using our service, you agree to be bound by these terms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">2. Service Description</h3>
              <p className="text-gray-300">
                Ultra Times is a platform for selling digital content on the Ultra blockchain. We offer articles, collections, and services related to digital content.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">3. Pricing and Payment</h3>
              <p className="text-gray-300">
                Prices are indicated in Ultra tokens (UOS). Payment is made directly through the Ultra blockchain. Transactions are irreversible once confirmed on the blockchain.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">4. Delivery</h3>
              <p className="text-gray-300">
                Digital content delivery is immediate after payment confirmation on the blockchain. The content is directly accessible in your Ultra wallet.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">5. Warranties</h3>
              <p className="text-gray-300">
                We guarantee that the digital content sold matches its description. In case of non-compliance, we commit to refund the transaction amount within 14 days.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">6. Applicable Law and Jurisdiction</h3>
              <p className="text-gray-300">
                These terms are governed by French law. In case of dispute, French courts will have exclusive jurisdiction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">7. Consumer Protection</h3>
              <p className="text-gray-300">
                In accordance with current legislation, you have a 14-day withdrawal period from the date of receipt of the digital content.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary-300 mb-4">8. Contact</h3>
              <p className="text-gray-300">
                For any questions regarding our terms of sale, you can contact us at: legal@ultratimes.com
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

export default TermsOfServicePage 