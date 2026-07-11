import { Link } from "react-router-dom";

export default function MobileDropdown({
  title,
  to,
  items,
  isOpen,
  onToggle,
  setMobileOpen,
}) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center gap-4">
        <Link
          to={to}
          onClick={() => setMobileOpen(false)}
          className="text-[20px] font-semibold font-title"
        >
          {title}
        </Link>
        <button
          onClick={onToggle}
          className="text-(--orange) text-3xl leading-none"
          aria-label={`Toggle ${title} menu`}
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-4 pl-2 text-[18px]">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`block ${item.className || ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
