export {};

declare global {
  type Address = `0x${string}`;

  type Status =
    | "UNVERIFIED"
    | "PROCESSING"
    | "INFO_REQUIRED"
    | "VERIFIED"
    | "REJECTED";

  type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "SEVERE";

  type RiskTag =
    | "MALICIOUS_ADDR"
    | "SUSPECTED_MALICIOUS_ADDR"
    | "HIGH_RISK_ADDR"
    | "MEDIUM_RISK_ADDR"
    | "MIXER"
    | "RISK_EXCHANGE"
    | "GAMBLING"
    | "INVOLVED_THEFT_ACTIVITY"
    | "INVOLVED_RANSOM_ACTIVITY"
    | "INVOLVED_PHISHING_ACTIVITY"
    | "INTERACT_MALICIOUS_ADDR"
    | "INTERACT_SUSPECTED_MALICIOUS_ADDR"
    | "INTERACT_HIGH_RISK_ADDR"
    | "INTERACT_MEDIUM_RISK_ADDR";

  type Action = "WHITELISTED" | "BLACKLISTED" | null;

  type AddressDetail = {
    address: Address;
    riskLevel: RiskLevel;
    riskTags: RiskTag[];
    timeScanned: number;
    action: Action;
  };

  type BasicUserInfo = {
    id: string;
    type: "INDIVIDUAL" | "CORPORATE";
    status: {
      basic: Status;
      poa: status;
    };
    basicInfo: {
      country: string;
      nonUS: boolean;
      nonEU: boolean;
      eighteenPlus: boolean;
      pep: number | null;
    };
    addresses: AddressDetail[];
    timeUpdated: number;
  };

  type FullUserInfo = {
    id: string;
    type: "INDIVIDUAL" | "CORPORATE";
    status: {
      basic: Status;
      poa: status;
    };
    basicInfo: {
      country: string;
      nonUS: boolean;
      nonEU: boolean;
      eighteenPlus: boolean;
      pep: number | null;
    };
    fullInfo: {
      firstName: string;
      firstNameEn: string;
      middlName: string;
      middleNameEn: string;
      lastName: string;
      lastNameEn: string;
      idDocs: IdDoc[];
    };
    addresses: AddressDetail[];
    timeUpdated: number;
  };
}
