import React from 'react'
import { Container } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb2";
const MultipurposeSMS = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title="Multipurose"
                        breadcrumbItems={[{title:"Tools"},{title:"SMS API"},{title:"Multipurose"}]}
                    />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default MultipurposeSMS