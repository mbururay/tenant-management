import "./App.css";

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Dashboard
import Dashboard from "./pages/landing/Dashboard.jsx";
import DashboardSummary from "./pages/landing/DashboardSummary.jsx";

// Tenant
import TenantView from "./pages/tenant_view/TenantView.jsx";
import TenantDashboard from "./pages/tenant_view/TenantDashboard.jsx";
import TenantTables from "./pages/tenant_view/TenantTables.jsx";
import TenantRecords from "./pages/tenant_records/TenantRecords.jsx";
import AddTenant from "./pages/tenant_records/AddTenant.jsx";
import TenantConfirm from "./pages/tenant_records/TenantConfirm.jsx";
import ModifyTenant from "./pages/tenant_records/ModifyTenant.jsx";
import ModifyTenantConfirm from "./pages/tenant_records/ModifyTenantConfirm.jsx";
import MoveOutTenant from "./pages/tenant_records/MoveOutTenant.jsx";
import MoveOutConfirm from "./pages/tenant_records/MoveOutConfirm.jsx";
import SearchTenant from "./pages/tenant_records/SearchTenant.jsx";

// Water
import WaterUpdate from "./pages/water_records/WaterUpdate.jsx";
import WaterConfirm from "./pages/water_records/WaterConfirm.jsx";
import WaterRecords from "./pages/water_records/WaterRecords.jsx";
import SearchWater from "./pages/water_records/SearchWater.jsx";
import WaterModify from "./pages/water_records/WaterModify.jsx";
import WaterModifyConfirm from "./pages/water_records/WaterModifyConfirm.jsx";

// Invoices
import IGenerate from "./pages/invoice_generation/IGenerate.jsx";
import InvoiceView from "./pages/invoice_generation/InvoiceView.jsx";
import InvoiceList from "./pages/invoice_generation/InvoiceList.jsx";
import InvoiceRecords from "./pages/invoice_generation/InvoiceRecords.jsx";
import InvoiceSearch from "./pages/invoice_generation/InvoiceSearch.jsx";
import InvoiceMonth from "./pages/invoice_generation/InvoiceMonth.jsx";
import InvoicePrint from "./pages/invoice_generation/InvoicePrint.jsx";
import InvoiceCorrectionPrint from "./pages/invoice_generation/InvoiceCorrectionPrint.jsx";
import ICorrect from "./pages/invoice_generation/ICorrect.jsx";
import ICorrectConfirm from "./pages/invoice_generation/ICorrectConfirm.jsx";

// Payments
import PayUpdate from "./pages/payment_records/PayUpdate.jsx";
import TenantPayUpdate from "./pages/payment_records/TenantPayUpdate.jsx";
import TenantPayConfirm from "./pages/payment_records/TenantPayConfirm.jsx";
import PaymentRecords from "./pages/payment_records/PaymentRecords.jsx";
import PayCorrections from "./pages/payment_records/PayCorrections.jsx";
import PayCorrectionsConfirm from "./pages/payment_records/PayCorrectionsConfirm.jsx";
import PaySearch from "./pages/payment_records/PaySearch.jsx";
import PaymentCorrectionPrint from "./pages/payment_records/PaymentCorrectionPrint.jsx";
import ReceiptPrint from "./pages/payment_records/ReceiptPrint.jsx";
import PaymentView from "./pages/payment_records/PaymentView.jsx";

// Bills
import BillSelect from "./pages/landlord_bills/billSelect.jsx";
import EnterBills from "./pages/landlord_bills/EnterBill.jsx";
import EnterBillConfirm from "./pages/landlord_bills/EnterBillConfirm.jsx";
import DisplayBills from "./pages/landlord_bills/DisplayBills.jsx";
import DisplayBillMonth from "./pages/landlord_bills/DisplayBillMonth.jsx";
import ModifyBill from "./pages/landlord_bills/ModifyBill.jsx";
import ModifyBillConfirm from "./pages/landlord_bills/ModifyBillConfirm.jsx";

const Protected = ({ element }) => (
    <ProtectedRoute>
        {element}
    </ProtectedRoute>
);

function App() {

    return (

        <Routes>

            {/* Public Routes */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ForgetPassword" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Dashboard */}

            <Route path="/" element={<Protected element={<Dashboard />} />} />
            <Route path="/DashboardSummary" element={<Protected element={<DashboardSummary />} />} />

            {/* Tenant */}

            <Route path="/TenantView" element={<Protected element={<TenantView />} />} />
            <Route path="/TenantDashboard" element={<Protected element={<TenantDashboard />} />} />
            <Route path="/TenantTables" element={<Protected element={<TenantTables />} />} />
            <Route path="/TenantRecords" element={<Protected element={<TenantRecords />} />} />
            <Route path="/AddTenant" element={<Protected element={<AddTenant />} />} />
            <Route path="/TenantConfirm" element={<Protected element={<TenantConfirm />} />} />
            <Route path="/ModifyTenant/:id" element={<Protected element={<ModifyTenant />} />} />
            <Route path="/ModifyTenantConfirm" element={<Protected element={<ModifyTenantConfirm />} />} />
            <Route path="/MoveOutTenant" element={<Protected element={<MoveOutTenant />} />} />
            <Route path="/MoveOutConfirm" element={<Protected element={<MoveOutConfirm />} />} />
            <Route path="/SearchTenant" element={<Protected element={<SearchTenant />} />} />

            {/* Water */}

            <Route path="/WaterUpdate" element={<Protected element={<WaterUpdate />} />} />
            <Route path="/WaterConfirm" element={<Protected element={<WaterConfirm />} />} />
            <Route path="/WaterRecords" element={<Protected element={<WaterRecords />} />} />
            <Route path="/SearchWater" element={<Protected element={<SearchWater />} />} />
            <Route path="/WaterModify/:id" element={<Protected element={<WaterModify />} />} />
            <Route path="/WaterModifyConfirm" element={<Protected element={<WaterModifyConfirm />} />} />

            {/* Invoices */}

            <Route path="/IGenerate" element={<Protected element={<IGenerate />} />} />
            <Route path="/InvoiceView/:id" element={<Protected element={<InvoiceView />} />} />
            <Route path="/InvoiceList" element={<Protected element={<InvoiceList />} />} />
            <Route path="/InvoiceRecords" element={<Protected element={<InvoiceRecords />} />} />
            <Route path="/InvoiceSearch" element={<Protected element={<InvoiceSearch />} />} />
            <Route path="/InvoiceMonth/:month" element={<Protected element={<InvoiceMonth />} />} />
            <Route path="/InvoicePrint/:month" element={<Protected element={<InvoicePrint />} />} />
            <Route path="/InvoiceCorrectionPrint/:id" element={<Protected element={<InvoiceCorrectionPrint />} />} />
            <Route path="/ICorrect/:invoiceId" element={<Protected element={<ICorrect />} />} />
            <Route path="/ICorrectConfirm" element={<Protected element={<ICorrectConfirm />} />} />

            {/* Payments */}

            <Route path="/PayUpdate" element={<Protected element={<PayUpdate />} />} />
            <Route path="/TenantPayUpdate/:id" element={<Protected element={<TenantPayUpdate />} />} />
            <Route path="/TenantPayConfirm" element={<Protected element={<TenantPayConfirm />} />} />
            <Route path="/PaymentRecords" element={<Protected element={<PaymentRecords />} />} />
            <Route path="/PayCorrections/:paymentId" element={<Protected element={<PayCorrections />} />} />
            <Route path="/PayCorrectionsConfirm" element={<Protected element={<PayCorrectionsConfirm />} />} />
            <Route path="/PaySearch" element={<Protected element={<PaySearch />} />} />
            <Route path="/PaymentCorrectionPrint/:id" element={<Protected element={<PaymentCorrectionPrint />} />} />
            <Route path="/ReceiptPrint/:paymentId" element={<Protected element={<ReceiptPrint />} />} />
            <Route path="/PaymentView" element={<Protected element={<PaymentView />} />} />

            {/* Bills */}

            <Route path="/BillSelect" element={<Protected element={<BillSelect />} />} />
            <Route path="/EnterBills" element={<Protected element={<EnterBills />} />} />
            <Route path="/EnterBillConfirm" element={<Protected element={<EnterBillConfirm />} />} />
            <Route path="/DisplayBills" element={<Protected element={<DisplayBills />} />} />
            <Route path="/DisplayBillMonth/:month" element={<Protected element={<DisplayBillMonth />} />} />
            <Route path="/ModifyBill/:month" element={<Protected element={<ModifyBill />} />} />
            <Route path="/ModifyBillConfirm" element={<Protected element={<ModifyBillConfirm />} />} />

        </Routes>

    );
}

export default App;