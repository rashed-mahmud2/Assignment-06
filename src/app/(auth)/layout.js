export default function LoginLayout({ children }) {
  return (
    <>
      {/* Full page without Navbar/Footer */}
      <div>
        {children}
      </div>
    </>
  );
}
