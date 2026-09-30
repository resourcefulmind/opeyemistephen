import PressTopline from './PressTopline';

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="press">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="press-wrap">
        <PressTopline />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
