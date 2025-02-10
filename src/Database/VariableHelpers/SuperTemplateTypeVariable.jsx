// for super admin

const SuperAllVariable = ["$FirstName$", "$LastName$"];
const ConfirmationEmail = ["$ActivateUrl$"];
const WelcomeEmail = ["$LoginUrl$", "$OutbooksTitle$"];
const ForgotPasswordEmail = ["$ResetPasswordUrl$"];
const InviteForSignUp = ["$ActivateUrl$", " $AppUrl$"];
const TwoFA = ["$VerificationCode$", "$OutbooksTitle$"];


const UnpaidUser_FirstMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const UnpaidUser_SecondMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const UnpaidUser_ThirdMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const UnpaidUser_DeletionMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const PaidUser_FirstMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const PaidUser_SecondMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const PaidUser_ThirdMail = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$"
];
const Reminder = [
  "$User.FirstName$",
  "$User.LastName$",
  "$User.FullName$",
  "$LastLoginDate$",

];
const Subscription = [
  "$SubscriptionPackageName$",
  "$NewUserSignUpDate$",
  "$SubscriptionPurchaseDate$",
  "$SubscriptionExpiredDate$",
  "$UserSoftDeletedDate$",
  "$NewOrganisationCreatedDate$",
  "$OrganisationLastUpdatedDate$"
];
const SubscriptionPurchase = [
  "$NewSubscription.Name$",
  "$NewSubscription.StartDate$",
  "$NewSubscription.EndDate$",
  "$NewSubscription.Price$",
  "$OldSubscription.Name$",
  "$OldSubscription.StartDate$",
  "$OldSubscription.EndDate$",
  "$OldSubscription.Price$",
  "$AttachInvoice$",
  "$Offer$"
];
const SubscriptionRenewal = [
  "$NewSubscription.Name$",
  "$NewSubscription.StartDate$",
  "$NewSubscription.EndDate$",
  "$NewSubscription.Price$",
  "$OldSubscription.Name$",
  "$OldSubscription.StartDate$",
  "$OldSubscription.EndDate$",
  "$OldSubscription.Price$",
  "$AttachInvoice$",
  "$Offer$"
];
export default {
  SubscriptionPurchase,
  SubscriptionRenewal,
  ConfirmationEmail,
  WelcomeEmail,
  ForgotPasswordEmail,
  InviteForSignUp,
  TwoFA,
  SuperAllVariable,
  UnpaidUser_FirstMail,
  UnpaidUser_SecondMail,
  UnpaidUser_ThirdMail,
  UnpaidUser_DeletionMail,
  PaidUser_FirstMail,
  PaidUser_SecondMail,
  PaidUser_ThirdMail,
  Reminder,
  Subscription
};
