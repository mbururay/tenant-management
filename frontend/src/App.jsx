import "./App.css"


import TenantView from './pages/tenant_view/TenantView.jsx'
import AddTenant from './pages/tenant_records/AddTenant.jsx'
import WaterUpdate from './pages/water_records/WaterUpdate.jsx'
import IGenerate from './pages/invoice_generation/IGenerate.jsx'
import TenantConfirm from './pages/tenant_records/TenantConfirm.jsx'
import WaterConfirm from "./pages/water_records/WaterConfirm.jsx"
import ModifyTenant from "./pages/tenant_records/ModifyTenant.jsx"
import MoveOutTenant from "./pages/tenant_records/MoveOutTenant.jsx"
import MoveOutConfirm from "./pages/tenant_records/MoveOutConfirm.jsx"
import InvoiceView from "./pages/invoice_generation/InvoiceView.jsx"
import InvoiceList from "./pages/invoice_generation/InvoiceList.jsx"
import PayUpdate from "./pages/payment_records/PayUpdate.jsx"
import TenantPayUpdate from "./pages/payment_records/TenantPayUpdate.jsx"
import TenantPayConfirm from "./pages/payment_records/TenantPayConfirm.jsx"
import TenantRecords from "./pages/tenant_records/TenantRecords.jsx"
import SearchTenant from "./pages/tenant_records/SearchTenant.jsx"
import ModifyTenantConfirm from "./pages/tenant_records/ModifyTenantConfirm.jsx"
import WaterRecords from "./pages/water_records/WaterRecords.jsx"
import SearchWater from "./pages/water_records/SearchWater.jsx"
import WaterModify from "./pages/water_records/WaterModify.jsx"
import WaterModifyConfirm from "./pages/water_records/WaterModifyConfirm.jsx"
import InvoiceRecords from "./pages/invoice_generation/InvoiceRecords.jsx"
import ICorrect from "./pages/invoice_generation/ICorrect.jsx"
import InvoiceSearch from "./pages/invoice_generation/InvoiceSearch.jsx"
import ICorrectConfirm from "./pages/invoice_generation/ICorrectConfirm.jsx"
import TenantDashboard from "./pages/tenant_view/TenantDashboard.jsx"
import BillSelect from "./pages/landlord_bills/billSelect.jsx"
import EnterBills from "./pages/landlord_bills/EnterBill.jsx"
import EnterBillConfirm from "./pages/landlord_bills/EnterBillConfirm.jsx"
import DisplayBills from "./pages/landlord_bills/DisplayBills.jsx"
import DisplayBillMonth from "./pages/landlord_bills/DisplayBillMonth.jsx"
import ModifyBill from "./pages/landlord_bills/ModifyBill.jsx"
import ModifyBillConfirm from "./pages/landlord_bills/ModifyBillConfirm.jsx"
import InvoiceMonth from "./pages/invoice_generation/InvoiceMonth.jsx"
import InvoicePrint from "./pages/invoice_generation/InvoicePrint.jsx"
import InvoiceCorrectionPrint from "./pages/invoice_generation/InvoiceCorrectionPrint.jsx"
import PaymentRecords from "./pages/payment_records/PaymentRecords.jsx"
import PayCorrections from "./pages/payment_records/PayCorrections.jsx"
import PayCorrectionsConfirm from "./pages/payment_records/PayCorrectionsConfirm.jsx"
import PaySearch from "./pages/payment_records/PaySearch.jsx"
import PaymentCorrectionPrint from "./pages/payment_records/PaymentCorrectionPrint.jsx"
import ReceiptPrint from "./pages/payment_records/ReceiptPrint.jsx"


import { Routes, Route } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Heading from "./components/Heading.jsx"
import TenantTables from "./pages/tenant_view/TenantTables.jsx"




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
      <Route path="TenantRecords" element={<TenantRecords />}/>

      <Route path="/MoveOutTenant" element={<MoveOutTenant />}/>
      <Route path="/MoveOutConfirm" element={<MoveOutConfirm />}/>
      <Route path="/InvoiceView/:id" element={<InvoiceView />}/>
      <Route path="/InvoiceList" element={<InvoiceList />}/>
      <Route path="/PayUpdate" element={<PayUpdate />}/>
      <Route path="/TenantPayUpdate/:id"element={<TenantPayUpdate />}/>
      <Route path="/TenantPayConfirm" element={<TenantPayConfirm />}/>
      <Route path="/SearchTenant" element={<SearchTenant />}/>
      <Route path="/ModifyTenant/:id" element={<ModifyTenant />}/>
      <Route path="/ModifyTenantConfirm" element={<ModifyTenantConfirm />}/>
      <Route path="/WaterRecords" element={<WaterRecords />}/>
      <Route path="SearchWater" element={<SearchWater />}/>
      <Route path="WaterModify/:id" element={<WaterModify />}/>
      <Route path="WaterModifyConfirm" element={<WaterModifyConfirm />}/>
      <Route path="InvoiceRecords" element={<InvoiceRecords />}/>
      <Route path="InvoiceSearch" element={<InvoiceSearch />}/>
      <Route path="/ICorrect/:invoiceId" element={<ICorrect />}/>
      <Route path="ICorrectConfirm" element={<ICorrectConfirm />}/>
      <Route path="TenantDashboard" element={<TenantDashboard />}/>
      <Route path="TenantTables" element={<TenantTables />}/>
      <Route path="BillSelect" element={<BillSelect />}/>
      <Route path="EnterBills" element={<EnterBills />}/>
      <Route path="EnterBillConfirm" element={<EnterBillConfirm />}/>
      <Route path="DisplayBills" element={<DisplayBills />}/>
      <Route path="DisplayBillMonth/:month" element={<DisplayBillMonth />}/>
      <Route path="ModifyBill/:month" element={<ModifyBill />}/>
      <Route path="ModifyBillConfirm" element={<ModifyBillConfirm />}/>
      <Route path="/invoiceMonth/:month" element={<InvoiceMonth />}/>
      <Route path="/InvoicePrint/:month" element={<InvoicePrint />}/>
      <Route path="/InvoiceCorrectionPrint/:id" element={<InvoiceCorrectionPrint/>}/>
      <Route path="PaymentRecords" element ={<PaymentRecords />}/>
      <Route path="PayCorrectionsConfirm" element = {<PayCorrectionsConfirm />}/>
      <Route path="PaySearch" element = {<PaySearch />}/>
      <Route path="/PayCorrections/:paymentId" element={<PayCorrections />}/>
      <Route path="/PaymentCorrectionPrint/:id" element={<PaymentCorrectionPrint />}/>
      <Route path="/ReceiptPrint/:paymentId" element={<ReceiptPrint />}/>


      
      
      

      
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