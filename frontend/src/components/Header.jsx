import logo from '../assets/logo.png';
import '../styles/Navbar.css';

export default function Header(){
    return(
        <div className="header">
            <div className="logo">
            <img src={logo} alt="Logo" />
            <h1>Voting App</h1>
      </div>
        </div>
    );
}