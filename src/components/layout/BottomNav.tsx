import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/bio', label: '生物' },
  { to: '/astro', label: '宇宙' },
  { to: '/bioastro', label: '交叉' },
  { to: '/admin', label: '管理' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-cosmic-nebulaPurple/20 bg-cosmic-bg/95">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `block px-2 py-3 text-center text-xs ${isActive ? 'text-cosmic-bioGreen' : 'text-slate-300'}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
