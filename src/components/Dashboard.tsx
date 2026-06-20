import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopDashboard } from './layout/DesktopDashboard'
import { MobileTabs } from './layout/MobileTabs'

export function Dashboard() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return isDesktop ? <DesktopDashboard /> : <MobileTabs />
}
