import { Link } from "react-router-dom";
import "./Heading.css"






const Heading = () => {
  return(
    <div id = 'header'>
        <div id = 'tenantView'>
            <Link id = 'nav-link' to = "/TenantTables">
              Tenant tables
            </Link>
          </div>

          <div id = 'addTenant'>
            <Link id = 'nav-link' to = "/TenantRecords">
              Tenant Records
            </Link>
            
          </div>

          <div id = 'uWater'>
            <Link id = 'nav-link' to = "/WaterRecords">
              Water Records
            </Link>
          
          </div>

          <div id = 'genInvoice'>
            <Link id = 'nav-link' to = "/InvoiceRecords">
              Invoice Records
            </Link>
          </div>

          <div id = 'payUpdate'>
            <Link id = 'nav-link' to = "/PayUpdate">
              Payment Records
            </Link>
          </div>

          <div id = 'landBills'>
            <Link id = 'nav-link' to = "/BillSelect">
              Landlord Bills
            </Link>
          </div>
      </div>
  )
}

export default Heading;