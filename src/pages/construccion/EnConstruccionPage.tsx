interface EnConstruccionPageProps {
  title: string;
}

export default function EnConstruccionPage({ title }: EnConstruccionPageProps) {
  return (
    <section>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        Esta sección está en construcción
      </p>
    </section>
  );
}
