import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Card, CardHeader, CardBody, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';
import moment from 'moment';
import Timeworked from 'components/Common/Timeworked';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import RequestDetailsModalTable from 'components/Tables/RequestDetailsModalTable';
import RequestHistoryModalTable from 'components/Tables/RequestHistoryModalTable';
import ModalRequestDetailsLoaders from 'components/Loaders/ModalRequestDetailsLoaders';
import ModalRequestHistoryLoader from 'components/Loaders/ModalRequestHistoryLoader';
import RequestActionsModalTable from 'components/Tables/RequestActionsModalTable';
import { requestModalSlice } from 'features/modal/requestModalSlice';
const RequestDetails = ({ modal, toggle, modalData, setModalData, history, params }) => {
  const dispatch = useDispatch()
  const body = document.body
  const closeModal = () => {
    dispatch(requestModalSlice.actions.closeModal())
    body.style.overflow = 'auto'
  }
  const userDetails = useSelector((state) => state.user)
  const [imgSrc, setImgSrc] = useState([]);
  useEffect(() => {
    setImgSrc([])
  }, [modalData])
  useEffect(() => {
  }, [params])
  //**End */

  //Timeworked//
  const [totalTimeWorked, setTotalTimeWorked] = useState();
  const [startTimer, setStartTimer] = useState();

  const checkAssignedDivision = (assignedDivision) =>{
    // return true
    return (userDetails.role === 'Division Head' || userDetails.role === 'Section Head' || userDetails.role === 'Assistant Section Head') && assignedDivision === userDetails.division.divisions_id
  }
  useEffect(() => {
    setStartTimer()
    if (modalData) {
      var totalTime = 0;
      modalData.request_history.map((item, index) => {
        var start = moment(new Date(item.created_at))
        var end = index + 1 !== modalData.request_history.length ? modalData.request_history[index + 1].created_at : new Date()
        var duration = moment.duration(moment(end).diff(start))

        if (item.status_id === 4 || item.status_id === 6) {
          totalTime += duration.asSeconds()
        }
      })
      setTotalTimeWorked(totalTime)
      modalData.status_id === 5 || modalData.status_id === 7 || modalData.status_id === 8 || modalData.status_id === 9 ? setStartTimer(false) : setStartTimer(true)
    }
  }, [modalData])
  //**End */
  return (
    <div>

      <Modal
        fullscreen
        isOpen={modal}
        toggle={() => closeModal()}
        fade={true}
      >
        {
          modalData ? (
            <>
              <ModalHeader toggle={() => { closeModal() }} tag="h5">
                Ticket Number ({modalData.ticket_number}),{' '}
                {
                  startTimer !== undefined ? (
                    <>
                      Time worked:{' '}
                      <Timeworked
                        data={totalTimeWorked}
                        startTimer={startTimer}
                      />
                    </>
                  ) : ''
                }
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md="5">
                    <UncontrolledAccordion defaultOpen={[
                      '1',
                    ]} stayOpen>
                      {
                        (userDetails.role === 'Administrator' || checkAssignedDivision(modalData.assigned_division)) && (
                          // userDetails.role === 'Administrator' && (
                          <AccordionItem>
                            <AccordionHeader targetId="2">
                              Actions
                            </AccordionHeader>
                            <AccordionBody accordionId="2">
                              <RequestActionsModalTable
                                modalData={modalData}
                                setModalData={setModalData}
                                params={params}
                              />
                            </AccordionBody>
                          </AccordionItem>
                        )
                        // )
                      }

                      <AccordionItem>
                        <AccordionHeader targetId="1">
                          Details
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <div className="table">
                            <RequestDetailsModalTable
                              modalData={modalData}
                              setModalData={setModalData}
                              imgSrc={imgSrc}
                              setImgSrc={setImgSrc}
                            />
                          </div>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>
                  </Col>
                  <Col md="7">
                    <Card>
                      <CardHeader>
                        History
                      </CardHeader>
                      <CardBody>
                        <div className="table">
                          <RequestHistoryModalTable
                            modalData={modalData}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={() => { closeModal() }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader toggle={() => { closeModal() }} tag="h5">
                <span>Ticket Number: {" "}{" "}<Skeleton width={150} inline={true} />{' '},{' '}
                  Time worked: {' '}<Skeleton width={150} />
                </span>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md="5">
                    <UncontrolledAccordion defaultOpen={[
                      '1',
                    ]} stayOpen>
                      {
                        userDetails.role !== 'Requestor' ? (
                          <AccordionItem>
                            <AccordionHeader targetId="2">
                              Actions
                            </AccordionHeader>
                            <AccordionBody accordionId="2">
                              <Skeleton />
                            </AccordionBody>
                          </AccordionItem>
                        ) : ''
                      }

                      <AccordionItem>
                        <AccordionHeader targetId="1">
                          Details
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <div className="table">
                            <ModalRequestDetailsLoaders />
                          </div>
                        </AccordionBody>
                      </AccordionItem>

                    </UncontrolledAccordion>
                  </Col>
                  <Col md="7">
                    <Card>
                      <CardHeader>
                        History
                      </CardHeader>
                      <CardBody>
                        <div className="table">
                          <ModalRequestHistoryLoader />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={() => { closeModal() }}>
                  Close
                </Button>
              </ModalFooter>
            </>

          )
        }

      </Modal>
    </div >
  )
}

export default RequestDetails