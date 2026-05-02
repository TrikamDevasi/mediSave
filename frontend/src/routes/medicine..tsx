import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medicine/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/medicine/"!</div>
}
