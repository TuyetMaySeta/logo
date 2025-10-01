import EmployeeManagement from '@/components/EmployeeManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EmployeeManagement />
}
