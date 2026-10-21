import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Sidebar navigation shared by learner and admin shells.
 * groups: [{ title, items: [{ to, label, icon, badge, end }] }]
 */
export default function AppSidebar({ groups, collapsed = false, tone = 'dark', onNavigate }) {
  const dark = tone === 'dark'
  return (
    <nav aria-label="Application" className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.title || 'main'}>
          {group.title && !collapsed && (
            <p className={cn('mb-1.5 px-3 text-[11px] font-semibold tracking-[0.12em] uppercase', dark ? 'text-white/45' : 'text-muted')}>{group.title}</p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:translate-x-0.5',
                      collapsed && 'justify-center px-2',
                      dark
                        ? isActive ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
                        : isActive ? 'bg-primary-soft text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className={cn('absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-full', 'bg-accent')} aria-hidden="true" />}
                        {Icon && <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />}
                        {collapsed ? <span className="sr-only">{item.label}</span> : <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && item.badge ? (
                          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', dark ? 'bg-accent text-ink' : 'bg-accent text-ink')}>{item.badge}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
