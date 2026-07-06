import ModuleClient from './ModuleClient';

export function generateStaticParams() {
  return Array.from({ length: 24 }, (_, i) => ({ id: String(i + 1) }));
}

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  return <ModuleClient params={params} />;
}
