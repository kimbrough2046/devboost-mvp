import "./globals.css";

export const metadata = {
  title: "DevBoost - AI-Powered WordPress Builder",
  description: "Turn your wireframes into fully functional WordPress pages effortlessly.",
  icons: {
    icon: "/favicon.ico", // This ensures Next.js knows about the favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <header>
          <h1>DevBoost</h1>
          <a href="#" className="cta-button">Save Development Time Now</a>
        </header>
        <main>{children}</main>
        <footer>
          <p>© {new Date().getFullYear()} DevBoost. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
