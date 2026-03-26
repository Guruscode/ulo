import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <h1 className="text-4xl font-bold text-foreground">Terms of Use</h1>
        <p className="mt-4 text-foreground/70">
          These terms govern access to and use of ULO, including public browsing, account usage, listing submissions, and dashboard access.
        </p>

        <div className="mt-10 space-y-8 text-foreground/75">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">Platform Use</h2>
            <p className="mt-2">
              You agree to use the platform lawfully and to provide accurate information when creating an account,
              publishing listings, booking hotels, or contacting other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">Listings and Content</h2>
            <p className="mt-2">
              Users remain responsible for the accuracy, legality, and ownership of content they submit. ULO may review,
              reject, suspend, or remove content that violates platform rules or creates risk for users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">Accounts</h2>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account credentials and for activity that occurs
              under your account. ULO may suspend or terminate accounts that misuse the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">No Guarantee</h2>
            <p className="mt-2">
              ULO provides a platform for discovery and management. We do not guarantee that listings, neighbourhood information,
              agent claims, or hotel details are error-free at all times, and users should perform appropriate verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">Changes to Terms</h2>
            <p className="mt-2">
              We may update these terms from time to time. Continued use of the platform after changes take effect means
              you accept the revised terms.
            </p>
          </section>
        </div>
      </main>
      <HomeFooter />
    </div>
  )
}
