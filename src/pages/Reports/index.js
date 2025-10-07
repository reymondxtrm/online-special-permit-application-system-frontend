import React from 'react'
import { Container } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
const Reports = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title="Management"
                        breadcrumbItem="Reports"
                    />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Reports