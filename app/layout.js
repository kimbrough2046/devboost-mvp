import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>DevBoost</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>© {new Date().getFullYear()} DevBoost. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
