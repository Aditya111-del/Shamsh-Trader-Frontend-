

export default function Privacy() {
  return (
    <div className="min-h-screen text-white pt-[150px] pb-24 px-6 max-w-4xl mx-auto" style={{ background: '#050705' }}>
      <h1 className="text-4xl md:text-5xl font-bold mb-10" style={{ letterSpacing: '-0.03em' }}>
        Privacy Policy
      </h1>
      <div className="space-y-8 text-white/60 leading-relaxed font-light">
        <p>
          Last updated: 2026
        </p>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Use of Information</h2>
          <p>
            We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>
        </section>
      </div>
    </div>
  );
}
