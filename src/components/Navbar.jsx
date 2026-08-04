import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="nav-bar">
            {/* Inner wrapper: centered + capped at the page width, so the brand and
                links line up with the page content while the green bar spans full width */}
            <div className="nav-inner">
                <Link to="/" className="brand">
                    <h2>⚽ Soccer Hub</h2>
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/create" className="nav-cta">Create Post</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar