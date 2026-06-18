import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function App() {
  const [query, setQuery] = useState('Technology companies in delhi')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function loadResults(endpoint, nextStatus = 'loading') {
    setStatus(nextStatus)
    setError('')
    setResults([])

    try {
      const response = await fetch(endpoint)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while loading results.')
      }

      setResults(data.results || [])
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!query.trim()) {
      setError('Enter a search query first.')
      return
    }

    const params = new URLSearchParams({ query: query.trim() })
    await loadResults(`${API_BASE_URL}/api/search?${params}`)
  }

  async function handleTestData() {
    await loadResults(`${API_BASE_URL}/api/test-results`, 'loading-test')
  }

  return (
    <main className="app-shell">
      <section className="search-panel">
        <div>
          <p className="eyebrow">AI Web Scraper</p>
          <h1>Business contact finder</h1>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Technology companies in delhi"
          />
          <button disabled={status === 'loading' || status === 'loading-test'} type="submit">
            {status === 'loading' ? 'Scraping...' : 'Search'}
          </button>
          <button
            className="secondary-button"
            disabled={status === 'loading' || status === 'loading-test'}
            type="button"
            onClick={handleTestData}
          >
            {status === 'loading-test' ? 'Loading...' : 'Test Data'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="results-section">
        {status === 'idle' && (
          <p className="empty-state">Search for an industry or business category to fetch Google Maps data and website contacts.</p>
        )}

        {status === 'loading' && (
          <p className="empty-state">Fetching maps results and checking business websites. This can take a little while.</p>
        )}

        {status === 'loading-test' && (
          <p className="empty-state">Loading saved sample results.</p>
        )}

        {status === 'success' && results.length === 0 && (
          <p className="empty-state">No businesses found for that query.</p>
        )}

        {results.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Maps Phone</th>
                  <th>Website Phone</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Rating</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {results.map((business) => (
                  <tr key={`${business.name}-${business.website}`}>
                    <td>{business.name}</td>
                    <td>{business.phone_maps}</td>
                    <td>{business.phone_website}</td>
                    <td>{business.email}</td>
                    <td>
                      {business.website === 'N/A' ? (
                        'N/A'
                      ) : (
                        <a href={business.website} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      )}
                    </td>
                    <td>{business.rating}</td>
                    <td>{business.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
