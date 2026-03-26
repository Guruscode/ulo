import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-foreground/70">
          This policy explains how ULO collects, uses, stores, and protects personal information across the website and dashboards.
        </p>

        <div className="mt-10 space-y-8 text-foreground/75">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
            <p className="mt-2">
              We collect information you provide directly, including account details, profile data, contact information,
              property submissions, hotel submissions, and communication records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">How We Use Information</h2>
            <p className="mt-2">
              We use your information to operate the platform, verify listings, manage accounts, process submissions,
              improve product performance, and communicate important updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">Sharing and Disclosure</h2>
            <p className="mt-2">
              We do not sell personal information. We may share limited information with service providers that support
              hosting, email delivery, media storage, analytics, and payment processing where necessary to run the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">Data Retention and Security</h2>
            <p className="mt-2">
              We retain information for as long as needed to provide services, comply with legal obligations, and resolve disputes.
              We apply reasonable technical and operational safeguards to protect stored data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">Your Choices</h2>
            <p className="mt-2">
              You can update account information from your dashboard settings. You may also contact support if you need help
              with account corrections or data-related requests.
            </p>
          </section>
        </div>
      </main>
      <HomeFooter />
    </div>
  )
}
