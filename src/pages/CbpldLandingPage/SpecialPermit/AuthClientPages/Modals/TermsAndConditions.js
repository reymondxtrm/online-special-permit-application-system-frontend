import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function TermsAndConditions({ toggle, isOpen, setApproveTerm }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-primary">
        {" "}
        <h5 style={{ color: "white", fontWeight: "bold" }}>
          Terms and Conditions (Landbank)
        </h5>
      </ModalHeader>
      <ModalBody style={{ overflowY: "auto", height: "80vh" }}>
        <ol style={{ color: "black" }} className="d-flex flex-column gap-3">
          <li>
            {" "}
            This allows customers, taxpayers and payors, otherwise known as the
            &quot;User&quot; of the CIty Government of Butuan to process and
            make payments of taxes, fees and charges via internet using LANDBANK
            OF THE PHILIPPINES internet payment gateway or channel through
            Landbank&apos;s e-payment facility, otherwise known as the
            &quot;LANDBANK Link.BizPortal &quot;, that can process transactions
            at the comfor of the user&apos; location whether in the country or
            overseas.
          </li>
          <li>
            The LANDBANK Link.BizPortal allow the use of LANDBANK ATM Cards,
            BancNet Member-Bank&apos;s ATM / Debit Cards as payment options. it
            is a convenient, fast and easy way to make payments online.
          </li>
          <li>
            <p>
              The <strong> user will be charged</strong> a
              convineience/service/transaction fee, otherwise knowm as
              transaction fee for brevity, subject to changes depending on the
              facility policy:
            </p>
            <ul>
              <li>
                LandBank ATM Card/Visa Debit Card a fixed rate of Php{" "}
                <strong>Php 7.00</strong>.
              </li>
              <li>
                BancNet Member-Bank`&apos;`s ATM / Debit Card a fixed rate of{" "}
                <strong> Php 17.00</strong>.
              </li>
              <li>
                Cash Payment and E-wallets (Gcsah, Maya, ShopeePay and GrabPay)
                a fixed rate of <strong>Php 30.00</strong> per transaction;
              </li>
            </ul>
          </li>
          <li>
            LANDBANK as the Electronic Payment Collection Service provider will
            rece the full amount of the transaction fees. The City Goverment of
            Butuan has no share in these fees, which are collected on the top of
            the assessed amount due the City Government.
          </li>
          <li>
            Once a User has accepted these Terms and Conditions, it will be
            directed to LANDBANK Link.BizPortal and the Online Services of the
            City Givernment of Butuan shall not ne liable fot the resultant
            efffects of anu server slow down/session timeout by the LANDBANK
            Link.BizPortal.
          </li>
          <li>
            The User agrees, understands and confirms that the personnel data
            including without limitation to details relating to card transmitted
            via the internet may be susceptible ot misuse, hacking, theft and/
            or fraud and that the City Government of Butuan has no control and
            liablity over such matters.
          </li>
          <li>
            Once the User is directed to the LANDBANK Link.BizPortal, the City
            Government of Butuan is not liable for any concerns regarding
            cancellation of the transaction under anu circumstances. Likewise,
            the City Government of Butuan shall not be liable for any clain of
            refund by the User relative thereto.
          </li>
          <li>
            The User accepts that the City Government of Butuan shall be free
            and immune fron consequences caused by fraudulent transaction(s) on
            account of misuse of card/bank details that are beyond its control.
          </li>
          <li>
            The User agrees that the card/banks details provide in relation to
            and in availing the aforesaid Service(s) must tbe correct and
            accurate and that the User warrants actual ownership or authority to
            use the same. The User further arees and udertakes to provide
            correctand valida bank/card details. coreect
          </li>
          <li>
            <p>
              The User may pat taxes, fees and other charges using the aforesaid
              bank/card account. By initiating a payment transaction or by
              issueng an online payment instruction and providing card/bank
              details, the User wararants, agrees and confirms that:
            </p>
            <ul>
              <li>
                The User is fully and lawfully entitiled to use such account for
                such transactions;
              </li>
              <li>
                The User is responsible in ensuring that the account details
                provided are accurate;
              </li>
              <li>
                The User is authorizing a debit of the nominated account for the
                payment of corresponding taxes, fees and charges selected by
                such User along with the applicable incidental charges.
              </li>
              <li>
                The User is responsible in ensuring the availability of
                sufficient credit/balance on the niminated account at the time
                of payment in order to proceed with the transaction and payment
                of all corresponding online services dues owing to the City
                Government.
              </li>
            </ul>
          </li>
          <li>
            The Terms and Condition contained herein are gverned by the laws if
            the Republic of the Philippines and the User agrees thay all suits
            intended to enforce and/or dispute(s) arising from this Agreement
            will only bbe settled in the proper courts of the City of Butuan to
            the exclusion of all other courts.
          </li>
          <li>
            The User affirms ti have read and fully undertood the terms and
            Conditions of the City Government of Butuan&apos;s online Services
            before entering the LANDBANK LInk.BizPortal Payment Gateway and
            hereby agrees to be bound by the said terms and conditions.
          </li>
        </ol>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => {
            setApproveTerm(true);
            toggle();
          }}
        >
          I AGREE
        </Button>
        <Button onClick={toggle}>CLOSE</Button>
      </ModalFooter>
    </Modal>
  );
}
