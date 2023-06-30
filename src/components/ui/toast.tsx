interface ToastProps {
  title: string;
  children?: React.ReactNode;
}

export function Toast({ title, children }: ToastProps) {
  return (
    <div className="flex flex-col space-y-2 text-primary">
      <div className="text-lg font-semibold">{title}</div>
      {children && <div className="text-md opacity-90">{children}</div>}
    </div>
  );
}
