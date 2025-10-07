import React, { useState, useEffect, useCallback } from 'react'
import { Table, Badge, Placeholder } from 'reactstrap';
import ImageViewer from 'react-simple-image-viewer';
import moment from 'moment';
import axios from 'axios';
import { Buffer } from 'buffer';
import RemovePersonnel from 'components/Modals/Actions/removePersonnel';
const RequestDetailsModalTable = ({
  modalData,
  setModalData,
  imgSrc,
  setImgSrc
}) => {
  //**Image Viewer */
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    if (modalData) {
      setImgLoading(true);
      modalData.uploaded_files.map((element, index) => {
        axios.get('api/get-uploaded-screenshot/' + element.uploaded_files_id, {
          responseType: "arraybuffer"
        }).then(res => {
          const base64Str = Buffer.from(res.data, 'utf8').toString('base64');
          setImgSrc(imgSrc => ([...imgSrc, `data:;base64,${base64Str}`]))
          setImgLoading(false);
        }, error => {
          console.log(error.response.data.message)
          setImgLoading(false);
        })
      });

      if (modalData.uploaded_files.length === 0) {
        setImgLoading(false);
      }
    }
  }, [modalData])
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  //**End */
  return (
    <div style={{height:'50vh'}} className="tableFixHead"> 
      <Table className="table mb-0">
        <tbody>
          <tr>
            <th scope="row">Date & Time Requested:</th>
            <td>{moment(modalData.created_at).format('MMMM D, YYYY h:mm a')}</td>
          </tr>
          <tr>
            <th scope="row">Current Status:</th>
            <td>
              {
                <Badge color={modalData.status.color}>
                  {modalData.status.status_description}
                </Badge>
              }
            </td>
          </tr>
          <tr>
            <th scope="row">Assigned Division:</th>
            <td>{modalData.divisions.division}</td>
          </tr>
          <tr>
            <th scope="row">Assigned Personnel(s):</th>
            {
              modalData.request_assignment.length === 0 ? (
                <>
                  <td className='text-danger'>
                    Unassigned
                  </td>
                </>
              ) : (
                <td>{
                  (modalData.request_assignment.map((person) => (
                    <span style={{ whiteSpace: 'pre-line' }} key={person.request_assignment_id + 'request_assignment'}>
                      <Badge>
                        {person.tbl_users.first_name + ' ' + (person.tbl_users.middle_name ? (person.tbl_users.middle_name.charAt(0) + '. ') : '') + person.tbl_users.last_name + (person.tbl_users.suffix ? ', ' + person.tbl_users.suffix : '')}
                      </Badge>{" "}
                      <RemovePersonnel personnelId={person.assigned_personnel} requestId={modalData.request_details_id} setModalData={setModalData} />
                      {"\n"}
                    </span>
                  )))
                }
                </td>
              )

            }
          </tr>
          <tr>
            <th scope="row">Requestor:</th>
            <td>{modalData.tbl_users.first_name + ' ' + (modalData.tbl_users.middle_name ? (modalData.tbl_users.middle_name.charAt(0) + '. ') : '') + modalData.tbl_users.last_name + (modalData.tbl_users.suffix ? ', ' + modalData.tbl_users.suffix : '')}</td>
          </tr>
          <tr>
            <th scope="row">Office:</th>
            <td>{modalData.tbl_users.offices.office_description}</td>
          </tr>
          <tr>
            <th scope="row">Request Type:</th>
            <td>{modalData.service_request.service_request_types.service_request_type_description}</td>
          </tr>
          <tr>
            <th scope="row">Service Requested:</th>
            <td>{modalData.service_request.service_request_description}</td>
          </tr>
          <tr style={{ whiteSpace: 'pre-line' }}>
            <th scope="row">Request Description:</th>
            <td>{modalData.request_description}</td>
          </tr>
          <tr>
            <th scope="row">Level:</th>
            <td>{modalData.level}</td>
          </tr>
          <tr>
            <th scope="row">Attached Screenshots:</th>
            <td>
              {

                !imgLoading ? (
                  imgSrc && (
                    <>
                      {
                        imgSrc.map((img, index) => {
                          return (
                            <img
                              key={index + modalData.ticket_number}
                              src={img}
                              height="40"
                              style={{ margin: "2px", cursor: 'pointer' }}
                              alt=""
                              onClick={() => openImageViewer(index)}
                            />
                          )
                        })
                      }
                      {
                        isViewerOpen && (
                          <ImageViewer
                            src={imgSrc}
                            currentIndex={currentImage}
                            disableScroll={false}
                            closeOnClickOutside={true}
                            onClose={closeImageViewer}
                          />
                        )
                      }
                    </>
                  )

                ) : (
                  <Placeholder
                    animation="glow"
                  >
                    <Placeholder lg={4} />
                  </Placeholder>
                )
              }
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default RequestDetailsModalTable