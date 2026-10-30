/** Asterisco que marca un campo obligatorio */
export function RequiredMark() {
  return (
    <span aria-hidden className="text-destructive">
      *
    </span>
  );
}
