import { BookOpen } from 'lucide-react'
import { ICONS } from './iconRegistry'

export default function Icon({ name, ...props }) {
  const Component = ICONS[name] || BookOpen
  return <Component aria-hidden="true" {...props} />
}
