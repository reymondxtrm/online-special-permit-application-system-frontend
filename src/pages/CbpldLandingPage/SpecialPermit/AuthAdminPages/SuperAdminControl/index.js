import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import Swal from "sweetalert2";

export default function SuperAdminControl() {
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [userOtp, setUserOtp] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentRes, otpRes] = await Promise.all([
          axios.get("api/admin/get-payment-status"),
          axios.get("api/admin/get-user-otp"),
        ]);

        setPaymentStatus(paymentRes.data);
        setUserOtp(otpRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  console.log(paymentStatus, userOtp);
  const handleChangePaymentState = async (id) => {
    // Ask for confirmation first
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the payment status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // exit if cancelled

    try {
      const response = await axios.post(
        "api/admin/payment-status/update",
        null,
        {
          params: { special_permit_application_id: id },
        }
      );

      console.log(response);

      // Show success message
      Swal.fire({
        title: "Updated!",
        text: "Payment status has been updated.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Failed to update payment status.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className="page-content">
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>
                <Card>
                  <CardHeader>Payment Status</CardHeader>
                  <CardBody>
                    <Table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Requestor Name</th>
                          <th>Application Type</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentStatus && paymentStatus.length > 0 ? (
                          paymentStatus.map((detail, index) => {
                            const member =
                              detail.special_permit_application
                                ?.corporation_member;
                            const name = member
                              ? member.full_name
                              : detail.special_permit_application?.user
                                  ?.full_name;

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{name}</td>
                                <td>
                                  {
                                    detail.special_permit_application
                                      .special_permit_type.name
                                  }
                                </td>
                                <td>{detail.created_at}</td>
                                <td>{detail.payment_on_progress}</td>
                                <td>
                                  <Button
                                    onClick={() =>
                                      handleChangePaymentState(
                                        detail.special_permit_application_id
                                      )
                                    }
                                  >
                                    Update
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center">
                              No Data..
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardHeader>User OTP</CardHeader>
                  <CardBody>
                    <Table>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Otp</th>
                          <th>Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOtp && userOtp.length > 0
                          ? userOtp.map((otp, index) => (
                              <tr key={index}>
                                <td>{otp?.user?.username}</td>
                                <td>{otp?.otp}</td>
                                <td>{otp?.expires_at}</td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
