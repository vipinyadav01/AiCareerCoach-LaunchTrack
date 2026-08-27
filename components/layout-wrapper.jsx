// Splash screen removed — the layout now renders content directly with no
// intro overlay. Kept as a thin wrapper so the root layout import is stable.
export default function LayoutWrapper({ children }) {
  return <>{children}</>;
}
