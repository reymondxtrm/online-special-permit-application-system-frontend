import React, { useEffect } from "react";
import { Table } from "reactstrap";
import CGBLogo from "../../../../../assets/images/cgbLogo.png";
import certificateHeader from "../../../../../assets/images/permitHeaderLine.png";
import "./cedulaApplicationForm.css";
import BasicInputField from "components/Forms/BasicInputField";
import { FieldArray, Formik } from "formik";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsForCedulaApplication } from "features/SpecialPermitClient";

const CedulaApplicationForm = React.forwardRef((props, ref) => {
  const { forViewing } = props;
  console.log(forViewing);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const applicationForCedulaIds =
    useSelector((state) => state.specialPermitClient.selectedApplicationId) ||
    [];
  const cedulaApplication =
    useSelector((state) => state.specialPermitClient.cedulaDetails) || [];

  useEffect(() => {
    dispatch(getUserDetailsForCedulaApplication(applicationForCedulaIds));
  }, [applicationForCedulaIds, dispatch]);

  return (
    <div
      ref={ref}
      style={{
        height: "auto",
        width: "100%",
        margin: "10px",
      }}
      className="cedula-form-container"
    >
      <Formik
        enableReinitialize
        initialValues={{
          employee: cedulaApplication.map((emp) => ({
            lname: emp.lname || "",
            fname: emp.fname || "",
            mname: emp.mname || "",
            address:
              user?.accountType === "individual"
                ? emp.user_addresses?.[0]?.full_address || ""
                : emp.user_addresses_morph?.[0]?.full_address || "",
            birth_date:
              user?.accountType === "individual"
                ? emp.user_details?.birth_date || ""
                : emp.user_details_morph?.birth_date || "",
            gender: emp.sex || "",
            citizenship: emp.citizenship || "",
            civil_status:
              user?.accountType === "individual"
                ? emp.user_details?.civil_status?.name || ""
                : emp.user_details_morph?.civil_status?.name || "",
            phone_no:
              user?.accountType === "individual"
                ? emp.user_phone_numbers?.[0]?.phone_number || ""
                : emp.user_phone_numbers_morph?.[0]?.phone_number || "",
            blood_type:
              user?.accountType === "individual"
                ? emp.user_details?.blood_type || ""
                : emp.user_details_morph?.blood_type || "",
            height:
              user?.accountType === "individual"
                ? emp.user_details?.height || ""
                : emp.user_details_morph?.height || "",
            weight:
              user?.accountType === "individual"
                ? emp.user_details?.weight || ""
                : emp.user_details_morph?.weight || "",
            place_of_birth:
              user?.accountType === "individual"
                ? emp.user_details?.birth_place || ""
                : emp.user_details_morph?.birth_place || "",
            tin:
              user?.accountType === "individual"
                ? emp.user_details?.tin || ""
                : emp.user_details_morph?.tin || "",
            proffession:
              user?.accountType === "individual"
                ? emp.user_occupation_details?.position || ""
                : emp.user_occupation_details_morph?.position || "",
            business_yearly_income:
              user?.accountType === "individual"
                ? emp.user_details?.business_yearly_income || ""
                : emp.user_details_morph?.business_yearly_income || "",
            profession_yearly_income:
              user?.accountType === "individual"
                ? emp.user_occupation_details?.yearly_income || ""
                : emp.user_occupation_details_morph?.yearly_income || "",
          })),
        }}
      >
        {(formikProps) => (
          <FieldArray name="employee">
            {(arrayHelper) => (
              <>
                {cedulaApplication.length <= 0 ? (
                  <div>
                    <span>All Application has Cedula</span>
                  </div>
                ) : (
                  <>
                    {cedulaApplication?.map((employee, index) => (
                      <div key={index} style={{ width: "348px" }}>
                        <Table className="table-container">
                          <thead>
                            <div className="request-header">
                              <img
                                src={CGBLogo}
                                alt="City Goverment of Butuan Logo"
                                className="logo"
                              />
                              <div className="request-header-right">
                                <span>Republic of the Philippines</span>
                                <span>CITY GOVERMENT OF BUTUAN</span>
                                <span className="fw-bold">
                                  CITY TREASURY DEPARTMENT
                                </span>
                                <span>
                                  City Hall Bldg., J,P. Rosales Ave., Doongan
                                  Butuan City
                                </span>
                                <img
                                  src={certificateHeader}
                                  className="headerline"
                                />
                              </div>
                            </div>
                            <div>
                              <span className="request-header-title ">
                                COMMUNITY TAX CERTIFICATE (CTC) INFORMATION FORM
                              </span>
                            </div>
                          </thead>
                          <tbody>
                            <table>
                              <tbody className="table-body">
                                <tr>
                                  <td>LAST NAME:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps.values.employee?.[index]
                                        .lname ?? ""
                                    ) : (
                                      <input
                                        name={`employee[${index}].lname`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.lname || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>FIRST NAME:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps.values.employee?.[index]
                                        .fname ?? ""
                                    ) : (
                                      <input
                                        name={`employee[${index}].fname`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.fname || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>MIDDLE NAME:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps.values.employee?.[index]
                                        .mname ?? ""
                                    ) : (
                                      <input
                                        name={`employee[${index}].mname`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.mname || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>ADDRESS:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.address ?? ""
                                    ) : (
                                      <input
                                        name={`employee[${index}].address`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.address || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>

                                <tr>
                                  <td>BIRTH DATE</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.birth_date ?? "  "
                                    ) : (
                                      <input
                                        name={`employee[${index}].birth_date`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.birth_date || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>GENDER:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.gender ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].gender`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.gender || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>CITIZENSHIP:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.citizenship ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].citizenship`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.citizenship || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>CIVIL STATUS:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.civil_status ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].civil_status`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.civil_status || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>CEL. NUM.:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.phone_no ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].phone_no`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.phone_no || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>BLOOD TYPE:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.blood_type ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].blood_type`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.blood_type || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>HEIGHT:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.height ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].height`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.height || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>WEIGHT:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.weight ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].weight`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.weight || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>PLACE OF BIRTH:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.place_of_birth ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].place_of_birth`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.place_of_birth || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>TIN #:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.tin ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].tin`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.tin || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>PROFFESSION:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.proffession ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].proffession`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.proffession || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>BUSINESS YEARLY INCOME:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.business_yearly_income ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].business_yearly_income`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.business_yearly_income || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>PROFFESSION YEARLY INCOME:</td>
                                  <td>
                                    {forViewing ? (
                                      formikProps?.values?.employee?.[index]
                                        ?.profession_yearly_income ?? " "
                                    ) : (
                                      <input
                                        name={`employee[${index}].profession_yearly_income`}
                                        onChange={formikProps.handleChange}
                                        value={
                                          formikProps?.values?.employee?.[index]
                                            ?.profession_yearly_income || ""
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <tfoot className="">
                              <div className="footer-text">
                                <p>
                                  I certify that the information povided is true
                                  and correct, and I consent to its collection
                                  and processing by the City Treasury Department
                                  for official transaction , in compliance with
                                  the Data Privacy Act pf 2012.
                                </p>
                                <div className="signature-area">
                                  <div className="underline"></div>
                                  <p>
                                    Signature over Printed Name of Payor /
                                    Authorized Representative
                                  </p>
                                </div>
                              </div>
                              <div className="revnumber">
                                <span>CTD.CD.F.004.REV01</span>
                              </div>
                            </tfoot>
                          </tbody>
                        </Table>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </FieldArray>
        )}
      </Formik>
    </div>
  );
});

CedulaApplicationForm.displayName = "CedulaApplicationForm";
export default CedulaApplicationForm;
