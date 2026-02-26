export default function LoadingScreen({ loaded }) {
  return (
    <div className={`loading-screen ${loaded ? 'hidden' : ''}`}>
      <div className="loading-title">Carter Lim</div>
      <div className="loading-subtitle">The Polymath's Diorama</div>
      <div className="loading-bar-track">
        <div
          className="loading-bar-fill"
          style={{ width: loaded ? '100%' : '60%' }}
        />
      </div>
      <div className="loading-percent">{loaded ? '100' : '...'} %</div>
    </div>
  )
}
