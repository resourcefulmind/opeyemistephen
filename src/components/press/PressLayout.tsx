import PressTopline from './PressTopline';

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="press">
      <div className="press-wrap">
        <PressTopline />
        <main>{children}</main>
      </div>
    </div>
  );
}
