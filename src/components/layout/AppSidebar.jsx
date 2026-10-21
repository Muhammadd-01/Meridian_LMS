import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Sidebar navigation shared by learner and admin shells.
 * groups: [{ title, items: [{ to, label, icon, badge, end }] }]
 */
export default function AppSidebar({ groups, collapsed = false, tone = 'dark', onNavigate }) {
  const dark = tone === 'dark'
  return (
    <nav aria-label="Application" className={cn('flex flex-col', dark ? 'gap-4' : 'gap-5')}>
      {groups.map((group) => (
        <div key={group.title || 'main'}>
          {group.title && !collapsed && (
            dark ? (
              <p className="mb-1.5 flex items-center gap-2 px-3 text-[10.5px] font-bold tracking-[0.16em] text-white/40 uppercase">
                {group.title}<span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />
              </p>
            ) : (
              <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">{group.title}</p>
            )
          )}
          {group.title && collapsed && dark && <span className="mx-auto mb-2 block h-px w-8 bg-white/10" aria-hidden="true" />}
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
                      'group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                      dark ? 'gap-3 px-2 py-1.5' : 'gap-3 px-3 py-2 hover:translate-x-0.5',
                      collapsed && 'justify-center px-2',
                      dark
                        ? isActive ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]' : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
                        : isActive ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_10px_20px_-12px_rgb(9_63_80/0.9)]' : 'text-slate-600 hover:bg-primary-soft hover:text-primary',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className={cn('absolute left-0 rounded-r-full bg-accent', dark ? 'top-2 bottom-2 -ml-3 w-1 shadow-[0_0_12px_2px_rgb(247_141_0/0.6)]' : 'top-1.5 bottom-1.5 w-1')} aria-hidden="true" />}
                        {Icon && (dark ? (
                          <span
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                              isActive
                                ? 'bg-gradient-to-br from-accent to-[#ffb347] text-deep shadow-[0_8px_18px_-8px_rgb(247_141_0/0.9)]'
                                : 'bg-white/[0.06] text-white/75 group-hover:scale-105 group-hover:bg-white/[0.12] group-hover:text-white',
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : (
                          <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                        ))}
                        {collapsed ? <span className="sr-only">{item.label}</span> : <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && item.badge ? (
                          <span className={cn('min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold', dark ? 'bg-accent/20 text-[#ffc072] ring-1 ring-accent/40' : 'bg-accent text-ink')}>{item.badge}</span>
                        ) : null}
                        {collapsed && item.badge ? <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-deep" aria-hidden="true" /> : null}
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
