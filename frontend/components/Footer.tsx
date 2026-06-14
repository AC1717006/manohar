export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-royal-charcoal">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg text-gradient-gold">Surendra Sa Rajputi Fashion</h3>
            <p className="mt-2 text-sm text-gold-light/70">
              Royal Rajputi Poshak, Bridal Wear &amp; Traditional Collections.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gold">Visit Us</h4>
            <p className="mt-2 text-sm text-gold-light/70">
              Utar Ghee Mandi, Naya Bazar,
              <br />
              Ajmer, Rajasthan 305001
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gold">Contact</h4>
            <p className="mt-2 text-sm text-gold-light/70">
              Phone:{" "}
              <a href="tel:+919649030231" className="hover:text-gold">
                +91 96490 30231
              </a>
            </p>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-gold-light/70 hover:text-gold"
            >
              Follow us on Instagram
            </a>
          </div>
        </div>
        <p className="mt-8 border-t border-gold/10 pt-6 text-center text-xs text-gold-light/50">
          &copy; {new Date().getFullYear()} Surendra Sa Rajputi Fashion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
