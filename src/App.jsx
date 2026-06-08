import { getEventPreviewIdFromUrl } from './utils/eventBrandPreview'
import Dashboard from './views/Dashboard'
import EventBrandPreviewView from './views/EventBrandPreviewView'

function App() {
  const previewEventId = getEventPreviewIdFromUrl()
  if (previewEventId) {
    return <EventBrandPreviewView eventId={previewEventId} />
  }
  return <Dashboard />
}

export default App
