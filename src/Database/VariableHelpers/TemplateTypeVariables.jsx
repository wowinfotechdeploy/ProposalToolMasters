const AllVariables = [
  "$Accountant.Partner.FirstName$",
  "$Accountant.Partner.LastName$",
  "$Accountant.Partner.Email$",
  "$Accountant.Partner.Phone$",
  "$Accountant.TradingName$",
  "$Accountant.TradingAddress$",
  "$Accountant.TradingAddressWithLineBreak$",
  "$Accountant.Partner.Address$",
  "$Accountant.Partner.AddressWithLineBreak$",
  "$Accountant.AffiliatedAccountingBodyName$",
  "$Accountant.CountryIncorporatedIn$",
  "$CurrentDate$",
];

const Quote = [
  "$Prospect.officer.firstName$",
  "$Prospect.officer.lastName$",
  "$ProposalRef$",
  "$User.firstName$",
  "$User.lastName$",
  "$ServiceDescription$",
  "$organisation.trading_business_name$", "$appUrl$"
];
const QuoteDecline = [
  "$signatory.last_name$",
  "$signatory.first_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$proposalCode$",
  "$organisation.trading_business_name$", "$appUrl$"

];
const Contract = [
  "$signingUrl$",
  "$owner.firstName$",
  "$owner.lastName$",
  "$organisation.trading_business_name$",
  "$organisation.logo_url$",
  "$signatory.firstName$",
  "$signatory.lastName$",
  "$documentName$", "$appUrl$"
];
const QuotePdf = [
  "$Prospect.officer.firstName$",
  "$Prospect.officer.lastName$",
  "$ProposalRef$",
  "$User.firstName$",
  "$User.lastName$",
  "$organisation.trading_business_name$", "$appUrl$"
];
const EmailInvite = [
  "$appUrl$",
  "$FirstName$",
  "$LastName$",
  "$activateUrl$",
  "$userName$",
  "$organisation.trading_business_name$",
];
const ContractViewed = [
  "$signatory.first_name$",
  "$signatory.last_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$event$",
  "$EngagementLetterCode$",
  "$organisation.trading_business_name$", "$appUrl$"
];
const ContractAccepted = [
  "$signatory.last_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$EngagementLetterCode$",
  "$signatory.first_name$",
  "$organisation.trading_business_name$",
  "$paymentGateway.name$",
  "$paymentGateway.link$", "$appUrl$",
  "$BankTransfer$"
];
const ContractDeclined = [
  "$signatory.last_name$",
  "$signatory.first_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$EngagementLetterCode$",
  "$reason$",
  "$organisation.trading_business_name$", "$appUrl$"
];
const EmailInviteForOrganisation = [
  "$appUrl$",
  "$FirstName$",
  "$LastName$",
  "$activateUrl$",
  "$userName$",
  "$organisation.trading_business_name$",
];
const QuoteAccepted = [
  "$signatory.last_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$proposalCode$",
  "$signatory.first_name$",
  "$organisation.trading_business_name$", "$appUrl$"
];

const QuoteAcceptedDeclinedEmailSendToSender = [
  "$owner.first_name$",
  "$owner.last_name$",
  "$proposalCode$",
  "$signatory.first_name$",
  "$signatory.last_name$",
  "$organisation.trading_business_name$",
  "$eventName$", "$appUrl$", "$signatory.full_name$"
];
const EngagementLetterAcceptedEmailSendToSender = [
  "$signatory.full_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$EngagementLetterCode$",
  "$organisation.trading_business_name$", "$appUrl$"
];
const EngagementLetterDeclinedEmailSendToReceiver = [
  "$signatory.last_name$",
  "$owner.first_name$",
  "$owner.last_name$",
  "$EngagementLetterCode$",
  "$signatory.first_name$",
  "$organisation.trading_business_name$",
  "$reason$", "$appUrl$"
];
const QuotationSendTriggerPoint = ["QuoteSendTrigger"
];
const QuotationViewTriggerPoint = ["QuotationViewTriggerPoint"
];
const QuotationAcceptedTriggerPoint = ["QuotationAcceptedTriggerPoint"
];
const QuotationDeclinedTriggerPoint = ["QuotationDeclinedTriggerPoint"
];
const EngagementLetterSendTriggerPoint = ["EngagementLetterSendTriggerPoint"
];
const EngagementLetterViewTriggerPoint = ["EngagementLetterViewTriggerPoint"
];
const EngagementLetterDeclinedTriggerPoint = ["EngagementLetterDeclinedTriggerPoint"
];
const EngagementLetterSignedTriggerPoint = ["EngagementLetterSignedTriggerPoint"
];
export default {
  AllVariables,
  Quote,
  Contract,
  QuotePdf,
  EmailInvite,
  ContractViewed,
  ContractAccepted,
  ContractDeclined,
  QuoteDecline,
  QuoteAccepted,
  EmailInviteForOrganisation,
  QuoteAcceptedDeclinedEmailSendToSender,
  EngagementLetterAcceptedEmailSendToSender,
  EngagementLetterDeclinedEmailSendToReceiver,
  QuotationSendTriggerPoint,
  QuotationViewTriggerPoint,
  QuotationAcceptedTriggerPoint,
  QuotationDeclinedTriggerPoint,
  EngagementLetterSendTriggerPoint,
  EngagementLetterViewTriggerPoint,
  EngagementLetterDeclinedTriggerPoint,
  EngagementLetterSignedTriggerPoint
};
