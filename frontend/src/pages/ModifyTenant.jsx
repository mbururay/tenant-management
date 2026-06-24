import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading"
import "./ModifyTenant.css"


const ModifyTenant = () => {
    const navigate = useNavigate();
    return(
        
        <div id = 'mainPage'>
            <Heading /> 

            <div>
                <h1>Modify Tenant</h1>
                <h2>Select your desired action</h2>

                <div id = 'buttonSet'>
                    <button onClick={() => navigate("/AddTenant")}>
                        Add Tenant
                    </button>

                    <button onClick={() => navigate("/AddTenant")}>
                        Change Tenant Records
                    </button>

                    <button onClick={() => navigate("/MoveOutTenant")}>
                        Remove Tenant
                    </button>
                </div>
            </div>
            
            

        </div>
    )

}

export default ModifyTenant;