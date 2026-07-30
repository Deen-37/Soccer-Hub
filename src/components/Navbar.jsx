import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <h2> Soccer Hub</h2>
            <div>
                <Link to="/"> Home </Link>
                <Link to="/create"> Create Post</Link>
            </div>
        </nav>
    )
}

export default Navbar