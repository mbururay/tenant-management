import "./App.css"


import TenantView from './pages/TenantView.jsx'
import AddTenant from './pages/AddTenant.jsx'
import WaterUpdate from './pages/WaterUpdate.jsx'
import IGenerate from './pages/IGenerate.jsx'
import TenantConfirm from './pages/TenantConfirm.jsx'
import WaterConfirm from "./pages/WaterConfirm.jsx"
import ModifyTenant from "./pages/ModifyTenant.jsx"
import MoveOutTenant from "./pages/MoveOutTenant.jsx"
import MoveOutConfirm from "./pages/MoveOutConfirm.jsx"
import InvoiceView from "./pages/InvoiceView.jsx"
import InvoiceList from "./pages/InvoiceList.jsx"
import PayUpdate from "./pages/PayUpdate.jsx"
import TenantPayUpdate from "./pages/TenantPayUpdate.jsx"
import TenantPayConfirm from "./pages/TenantPayConfirm.jsx"


import { Routes, Route } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Heading from "./components/Heading.jsx"



const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/TenantView" element={<TenantView />}/>
      <Route path="/AddTenant" element={<AddTenant />}/>
      <Route path="/WaterUpdate" element={<WaterUpdate />}/>
      <Route path="/IGenerate" element={<IGenerate />}/>
      <Route path="/TenantConfirm" element={<TenantConfirm />}/>
      <Route path="/WaterConfirm" element={<WaterConfirm />}/>
      <Route path="/ModifyTenant" element={<ModifyTenant />}/>

      <Route path="/MoveOutTenant" element={<MoveOutTenant />}/>
      <Route path="/MoveOutConfirm" element={<MoveOutConfirm />}/>
      <Route path="/InvoiceView/:id" element={<InvoiceView />}/>
      <Route path="/InvoiceList" element={<InvoiceList />}/>
      <Route path="/PayUpdate" element={<PayUpdate />}/>
      <Route path="/TenantPayUpdate/:id"element={<TenantPayUpdate />}/>
      <Route path="/TenantPayConfirm" element={<TenantPayConfirm />}/>

      
      
      

      
    </Routes>
    </div>
  )
}



//Header Section



//Landing Section
const Landing = () => {
  return(
    <div id = 'gLanding'>
      <Heading/>
      <CenText />
          
    </div>

    
  )
    
}



const CenText = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("button clicked");
    navigate("/TenantView");
  };
  return(
    <div id  = 'cenText'>
      
      <div id = 'cencen'>
        <h1 id = 'mainTitle'>
          Serene Homes Accounting
        </h1>
        <button type = 'button' id = 'cenButton' onClick={handleClick}>
          Click me
        </button>
      </div>
      
    </div>
  )
}






export default App