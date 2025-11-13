import TableLoaders from "components/Loaders/TableLoaders";
import { getCompanyOccupatinalData } from "features/SpecialPermitAdmin";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "reactstrap";

export default function OccupationaTableAdmin() {
  const dispatch = useDispatch();
  const specialPermitAdmin = useSelector((state) => state.specialPermitAdmin);
  const [selectedRow, setSelectedRow] = useState([]);
  useEffect(() => {
    dispatch(getCompanyOccupatinalData({ type: "compnay" }));
  }, []);
  const handleSetRow = (index) => {
    setSelectedRow((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };
  const handleAttachment = (index) => {};
  const toggleAttachmentModal = () => {

    
  };
  return (
    <Table>
      <thead>
        <th>#</th>
        <th>Name of Requestot / Corporation</th>
        <th>Gender</th>
        <th>Address</th>
        <th>Contact</th>
        <th>Attachment</th>
        <th>Actions</th>
      </thead>
      <tbody>
        {specialPermitAdmin.getCompanyOccupatinalIsFetching ? (
          specialPermitAdmin.companyOccupational.map((item, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => handleSetRow(index)}>
                <td colSpan={2}>{item.fname}</td>
                <td>{item.add}</td>
              </tr>
              {selectedRow?.includes &&
                item.special_permit_applications.lenght < 0 &&
                item.special_permit_applications.map((item, index) => (
                  <tr key={index}>
                    <td>{`${item?.corporation_member?.fname}  ${item?.corporation_member?.mname} ${item?.corporation_member?.lname}`}</td>
                    <td>{item?.corporation_member?.sex}</td>
                    <td>
                      {
                        item?.corporation_member?.user_addresses_morph
                          ?.full_address
                      }
                    </td>
                    <td>
                      {
                        item?.corporation_member?.user_phone_numbers_morph
                          ?.phone_number
                      }
                    </td>
                    <td>
                      <Button color="success" onClick={handleAttachment}>
                        Attachment
                      </Button>
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))
        ) : (
          <TableLoaders />
        )}
      </tbody>
    </Table>
  );
}
