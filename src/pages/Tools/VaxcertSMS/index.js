import React from 'react'
import { Container } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb2";
const VaxcertSMS = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title="Vaxcert"
                        breadcrumbItems={[{title:"Tools"},{title:"SMS API"},{title:"Vaxcert"}]}
                    />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default VaxcertSMS