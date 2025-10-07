import React from 'react'
import { Modal, Progress, Spinner, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ProgressBarModal = ({ show, handleClose, data, title }) => {

  return (
    <div>
      <Modal
        isOpen={show}
        onClosed={handleClose}
        backdrop="static"
        keyboard={false}
        size="md"
        centered
      >
        {/* <div className="ribbon-wrapper ribbon-xl">
                <div className="ribbon bg-primary">
                    Records Section
                </div>
            </div> */}


        <ModalHeader style={{ width: '100%' }}>{title} <Spinner className="float-right" animation="border" variant="primary" /></ModalHeader>

        <ModalBody>
          <Progress animated value={data} style={{
            height: '15px'
          }}>
            {data}%
          </Progress>
        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </Modal>
    </div>
  )
}
export default ProgressBarModal