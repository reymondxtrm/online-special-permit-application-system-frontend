export const CONDITIONS = [
  "Permittee shall furnish a copy of this permit to the City Transportation and Traffic Management Department (CTTMD) prior to the event.",
  "Permittee shall not engage in any activity that may cause damage to private or public property.",
  "Permittee shall ensure that the activity complies with existing laws, good morals, customs, official directives and orderly manner.",
  "Permittee shall be fully responsible  for any damages resulting from the activity and shall undertake to compensate affected parties accordingly.",
  "Permittee shall ensure that all roads, facilities, and areas used during the activity are cleaned, restored, and maintened. Loitering and improper disposal of waste are stricly prohibited;",
  "Any violation of the conditions set forth herein shall automatically declare this permit invalid and the organizer/s of the activity will be held liable for violation of law and/or ordinance; and",
  "This permit is valid on",
  "Permittee shall stricly comply with the approvad Traffic Management Plan. Any deviation therefrom shall be reported to the CBPLD;",
  "The vehicles participating the motorcade shall be a maximum of ",
  //UGP
  "Maintain the cleanliness of the",
];
export const EVENT_CERT_CONDITIONS = [0, 1, 2, 3, 4, 5, 6];
export const MOTORCADE_CERT_CONDITIONS = [0, 1, 2, 3, 4, 7, 5, 6];
export const PARADE_CERT_CONDITIONS = [0, 1, 2, 3, 4, 7, 5, 6];
export const RECORRIDA_CERT_CONDITIONS = [0, 1, 2, 3, 4, 7, 8, 5, 6];
export const USE_OF_GOVERNMENT_PROPERTY_CERT_CONDITIONS = [9, 1, 2, 3, 4, 5, 6];

export const EVENT_TYPES = [
  { value: "1", label: "Event with registration fee and Road Closure." },
  {
    value: "2",
    label: "Event without registration fee but with Road Closure.",
  },
  { value: "3", label: "Event without registration fee and Road Closure." },
  { value: "4", label: "Event without traffic assistance." },
];
export const NAME_OF_GOVERNMENT_PROPERTY = [
  { value: "a", label: "City Hall Lobby" },
  { value: "b", label: "City Hall Grounds" },
  { value: "c", label: "Libertad Sports Complex" },
  { value: "d", label: "Rizal Park" },
];

export const USER_PRIVACY =
  "I hereby voluntarily declare that all the information provided in this request form for the special permit is true, accurate, and complete to the best of my knowledge and belief. I fully understand that any false, misleading, or incomplete information may result in the disapproval of my application.";

export const REVISION_CODE = {
  good_moral: "CBPLD.BPLD.C.002.REV02",
  mayors_permit: "CBPLD.BPLD.C.002.REV00",
  event: "CBPLD.BPLD.P.019.REV01",
  motorcade: "CBPLD.BPLD.P.014.REV01",
  parade: "CBPLD.BPLD.P.015.REV01",
  recorrida: "CBPLD.BPLD.P.016.REV01",
  use_of_goverment_property: "CBPLD.BPLD.P.018.REV01",
  occupational_permit: "CBPLD.BPLD.C.002.REV01", // not final yet
};
