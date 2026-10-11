export default function SubtotalBar({
  subtotal,
  children,
}: {
  subtotal: number;
  children: React.ReactNode;
}) {
  return (
    <div className="subtotal-container">
      <div className="subtotal-text-container">
        <p className="subtotal-text label-s">SUBTOTAL</p>
        <p className="subtotal-amt h1">₾ {subtotal}</p>
      </div>
      {children}
    </div>
  );
}
