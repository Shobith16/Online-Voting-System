import axios from "axios";
import '../styles/Reele.css'


function Reele(){
    const clearvoters = async()=>{
        try {
            // Send DELETE request to remove candidate from the database
            await axios.delete(`http://localhost:5000/clearVoters`);
            
            alert("Re-Election Initiated Sucessfully")
          } catch (error) {
            console.error('Error removing candidate:', error);
            alert('Error removing candidate:', error)
          }
    };
    return (
        <div className="re_ele">
            <h1>All The Voters Details Will be Deleted!</h1>
            <br />
            <center><button className="clear" onClick={clearvoters}>Re-Election</button></center>
        </div>
    );
}
export default Reele;