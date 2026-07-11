import { Link } from "react-router-dom";

export default function HeaderDropdown({
  label,
  to,
  children,
  align = "center",
  width = "200px",
  textColorClass = "text-(--header-menu-txt-color-first)",
}) {
  return (
    <div className="relative group">
      <Link
        to={to}
        className={`flex items-center gap-1 font-semibold text-[16px]
                   ${textColorClass}
                   hover:text-(--header-menu-dropdown-item-txt-color-hover)
                   transition font-title cursor-pointer`}
      >
        {label}
        <span className="text-(--orange) text-sm transition-transform duration-300 group-hover:rotate-90 inline-block">
          <i className="fa-solid fa-angle-right"></i>
        </span>
      </Link>

      <div
        className={`
          absolute top-full mt-4
          ${align === "center" ? "left-1/2 -translate-x-1/2" : "right-0"}
          bg-white rounded-2xl shadow-xl py-6 px-5 space-y-5
          text-(--header-menu-dropdown-item-txt-color)
          opacity-0 invisible translate-y-3
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-300
        `}
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}
