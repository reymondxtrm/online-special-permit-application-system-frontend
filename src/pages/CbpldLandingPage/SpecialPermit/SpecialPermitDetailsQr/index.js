import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import axios from "axios";

const SpecialPermitDetailsQr = () => {
  const [error, setError] = useState();
  const [data, setData] = useState();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({ url: `api/qr-code-details/${id}` });
        if (response) {
          setData(response.data.permit);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
        setError(error.reponse.data);
      }
    };
    fetchData();
  }, []);
  const permitType = useMemo(() => {
    if (
      data?.special_permit_type?.code === "mayors_permit" ||
      data?.special_permit_type?.code === "good_moral"
    ) {
      return `${data.special_permit_type.name} Permit`;
    } else return `${data?.special_permit_type?.name || ""} Special Permit`;
  }, [data]);
  console.log(permitType);
  return (
    <div>
      <Card>
        <CardHeader>
          <h4 style={{ fontWeight: "bold" }}> Special Permit Details</h4>
        </CardHeader>
        <CardBody>
          {error ? (
            <p>{error}</p>
          ) : (
            <p>
              The owner of this <span className="fw-bold">{permitType} </span>{" "}
              No. <span className="fw-bold">{`${data?.reference_no} `} </span>{" "}
              is{" "}
              <span className="fw-bold">
                {`${data?.user?.fname} ${data?.user?.mname || ""} ${
                  data?.user?.lname
                }`}
              </span>{" "}
              resident of {data?.full_address}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
export default SpecialPermitDetailsQr;
