interface GroupProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const Group = ({ id, title, children }: GroupProps) => (
  <div>
    <h2 id={id} className="text-3xl text-cyan-900 font-bold mb-4">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);
