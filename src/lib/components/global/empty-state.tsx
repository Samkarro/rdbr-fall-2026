import "./styles/empty-state.styles.css";

export default function EmptyState({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <h2 className="empty-state-title h3">{title}</h2>
      <p className="empty-state-message body-m">{message}</p>
      <div className="empty-state-children-container">{children}</div>
    </div>
  );
}
