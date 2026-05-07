interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
  <section className="flex flex-col gap-2">
    <h1 className="text-2xl md:text-4xl font-bold text-sidebar-primary">{title}</h1>
    <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
  </section>
);
