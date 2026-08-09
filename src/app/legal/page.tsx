export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 text-zinc-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-12 uppercase tracking-tight">
          Legal <span className="text-red-500">Policies</span>
        </h1>

        <div className="space-y-16">
          <section id="privacy">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Privacy Policy</h2>
            <p className="leading-relaxed">
              At GermanGearsIndia, your privacy is our priority. We only collect the necessary information required to process your subscriptions and deliver your premium accessories. We do not sell, rent, or share your personal data with third parties outside of our core services. All payment information is securely processed.
            </p>
          </section>

          <section id="terms">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Terms of Service</h2>
            <p className="leading-relaxed">
              By subscribing to the GermanGearsIndia Elite Club or purchasing our accessories, you agree to abide by our community guidelines. Memberships are billed annually and grant you access to exclusive perks, WhatsApp groups, and VIP drives based on your tier. We reserve the right to revoke membership for violations of community standards.
            </p>
          </section>

          <section id="shipping">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Shipping Policy</h2>
            <p className="leading-relaxed">
              We offer premium shipping for all physical accessories. Orders are typically processed within 1-2 business days. Delivery times vary based on your location within India. Once your order is shipped, you will receive a tracking link via email or SMS. 
            </p>
          </section>

          <section id="returns">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Return Policy</h2>
            <p className="leading-relaxed">
              We stand by the quality of our products. If you receive a defective accessory, you may request a return or exchange within 7 days of delivery. 
              <strong> Note:</strong> Annual club memberships are non-refundable once activated.
            </p>
          </section>

          <section id="faq" className="bg-white/5 p-8 rounded-2xl border border-white/10 mt-12">
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider text-red-500">Frequently Asked Questions</h2>
            <div className="mb-4">
              <h3 className="font-semibold text-white mb-2">Have a query related to shipping?</h3>
              <p className="text-sm">
                If you have any questions regarding your accessory shipment, tracking, or delivery delays, please contact our support team immediately.
              </p>
            </div>
            <div className="inline-block px-4 py-2 bg-red-500/20 text-red-500 rounded-lg font-mono font-bold tracking-widest mt-2">
              Call Support: +91 8019591100
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
