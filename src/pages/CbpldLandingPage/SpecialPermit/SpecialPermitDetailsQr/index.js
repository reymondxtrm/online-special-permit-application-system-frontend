import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import axios from "axios";
import "./style.css";

const SpecialPermitDetailsQr = () => {
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    setError(null);
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`api/qr-code-details/${id}`);
        setData(response.data.permit);
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to fetch data");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const permitType = useMemo(() => {
    if (
      data?.special_permit_type?.code === "mayors_permit" ||
      data?.special_permit_type?.code === "good_moral"
    ) {
      return `${data.special_permit_type.name} Permit`;
    } else return `${data?.special_permit_type?.name || ""} Special Permit`;
  }, [data]);

  return (
    <div>
      <Card>
        <CardBody
          className={`table-body ${
            error ? "failed" : "success"
          } d-flex justify-content-center align-items-center`}
          style={{
            border: "3px solid ",
            borderRadius: "10px",
            borderColor: error ? " #c4160d" : "#1c897e",
          }}
        >
          {error ? (
            <div className="d-flex justify-content-center align-items-center">
              <p className="fw-bold" style={{ color: error ? "#c4160d" : "" }}>
                {error}
              </p>
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      <h5 className="fw-bold" style={{ color: "#144742ff" }}>
                        {" "}
                        Special Permit Details{" "}
                      </h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Special Permit No.:</td>
                    <td className="fw-bold">{data?.reference_no}</td>
                  </tr>
                  <tr>
                    <td>Permittee:</td>
                    <td className="fw-bold">{`${data?.user?.fname} ${
                      data?.user?.mname || ""
                    } ${data?.user?.lname}`}</td>
                  </tr>
                  <tr>
                    <td>Date Issued:</td>
                    <td className="fw-bold">{data?.released_date}</td>
                  </tr>
                  <tr>
                    <td>Valid until:</td>
                    <td className="fw-bold">{data?.valid_date}</td>
                  </tr>
                </tbody>
              </table>{" "}
              {/* <div className="d-flex flex-column">
                <span>{`Special Permit No. : ${data?.reference_no}`}</span>
                <span>{`Permittee: ${data?.user?.fname} ${
                  data?.user?.mname || ""
                } ${data?.user?.lname}`}</span>
                <span>{}</span>
              </div> */}
            </>
            // <p>
            //   The owner of this <span className="fw-bold">{permitType} </span>{" "}
            //   No. <span className="fw-bold">{`${data?.reference_no} `} </span>{" "}
            //   is{" "}
            //   <span className="fw-bold">
            //     {`${data?.user?.fname} ${data?.user?.mname || ""} ${
            //       data?.user?.lname
            //     }`}
            //   </span>{" "}
            //   resident of {data?.full_address}
            // </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
export default SpecialPermitDetailsQr;
