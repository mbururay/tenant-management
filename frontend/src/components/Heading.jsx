import { Link } from "react-router-dom";
import "./Heading.css"






const Heading = () => {
  return(
    <div id = 'header'>
        <div id = 'tenantView'>
            <Link id = 'nav-link' to = "/TenantView">
              Tenant View
            </Link>
          </div>

          <div id = 'addTenant'>
            <Link id = 'nav-link' to = "/ModifyTenant">
              Modify Tenant
            </Link>
            
          </div>

          <div id = 'uWater'>
            <Link id = 'nav-link' to = "/WaterUpdate">
              Update Water Records
            </Link>
          
          </div>

          <div id = 'genInvoice'>
            <Link id = 'nav-link' to = "/IGenerate">
              Generate Invoices
            </Link>
          </div>

          <div id = 'payUpdate'>
            <Link id = 'nav-link' to = "/PayUpdate">
              Update Payment
            </Link>
          </div>
      </div>
  )
}

export default Heading;