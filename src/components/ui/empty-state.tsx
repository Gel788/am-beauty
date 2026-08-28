import Link from "next/link";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("py-16 text-center md:py-24", className)}>
      <p className="headline-lg !text-xl">{title}</p>
      {description ? <p className="mx-auto mt-4 max-w-sm text-sm text-grey">{description}</p> : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn-chanel mt-8 inline-flex">
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="btn-chanel mt-8 cursor-pointer">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
