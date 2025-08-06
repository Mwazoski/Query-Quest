

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                QueryQuest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform and services.
              </p>
              <p className="text-gray-700 mb-4">
                By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name and email address when you create an account</li>
                <li>Profile information such as alias and institution</li>
                <li>Educational preferences and progress data</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Usage Information</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect certain information about your use of the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information (operating system, device type)</li>
                <li>Usage patterns and interaction with challenges</li>
                <li>Performance data and error logs</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.3 Cookies and Tracking</h3>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our Service</li>
                <li>Provide personalized content and features</li>
                <li>Improve our Service performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide, maintain, and improve our educational services</li>
                <li>Process your registration and manage your account</li>
                <li>Track your learning progress and provide personalized recommendations</li>
                <li>Send you important updates and notifications</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Ensure the security and integrity of our Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred</li>
                <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage and backup procedures</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-gray-700 mb-4">
                When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@queryquest.com<br />
                  <strong>Address:</strong> 123 Learning Street, Education City, EC 12345<br />
                  <strong>Phone:</strong> +1 (555) 123-4567<br />
                  <strong>Data Protection Officer:</strong> dpo@queryquest.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 