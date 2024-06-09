import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
        
        <div className="sidebar">
          <div className="sidebar-items">
              <Link><p>NEW</p></Link>
              <Link><p>POPULAR</p></Link>
              <Link><p>TRENDING</p></Link>
              <Link><p>MOST LIKED</p></Link>
          </div>
        </div>
      
    </div>
  )
}
