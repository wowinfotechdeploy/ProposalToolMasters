const OnlyForRecurring = [
    "$Net_Total_Recurring$",
    "$Discount_Recurring$",
    "$Discounted_Total_Recurring$",
    "$VAT_Recurring$",
    "$Grand_Total_Recurring$",
    "$Original_Price_Recurring$",
    "$Discount_Percentage_Recurring$",
    "$Discounted_Price_Recurring$",
    "$Payment_Frequency_Recurring$",
    // "$AllServices_Recurring$",
    // "$AllServicesWithPrice_Recurring$",
];


const OnlyForOneOff = [
    "$Net_Total_OneOff$",
    "$Discount_OneOff$",
    "$Discounted_Total_OneOff$",
    "$VAT_OneOff$",
    "$Grand_Total_OneOff$",
    "$Original_Price_OneOff$",
    "$Discount_Percentage_OneOff$",
    "$Discounted_Price_OneOff$",
    // "$AllServices_OneOff$",
    // "$AllServicesWithPrice_OneOff$",
];

const CombinedTableView = [
    "$Net_Total_WithTableView$",
    "$Discount_WithTableView$",
    "$Discounted_Total_WithTableView$",
    "$VAT_WithTableView$",
    "$Grand_Total_WithTableView$",
    "$Original_Price_WithTableView$",
    "$Discount_Percentage_WithTableView$",
    "$Discounted_Price_WithTableView$",
    "$AllServices_WithTableView$",
    "$AllServicesWithPrice_WithTableView$",
];

const CombinedCommaWise = [
    "$Net_Total_WithComma$",
    "$Discount_WithComma$",
    "$Discounted_Total_WithComma$",
    "$VAT_WithComma$",
    "$Grand_Total_WithComma$",
    "$Original_Price_WithComma$",
    "$Discount_Percentage_WithComma$",
    "$Discounted_Price_WithComma$",
    "$AllServices_WithComma$",
    "$AllServicesWithPrice_WithComma$",
];


const CombinedBulletWise = [
    "$Net_Total_WithBulletList$",
    "$Discount_WithBulletList$",
    "$Discounted_Total_WithBulletList$",
    "$VAT_WithBulletList$",
    "$Grand_Total_WithBulletList$",
    "$Original_Price_WithBulletList$",
    "$Discount_Percentage_WithBulletList$",
    "$Discounted_Price_WithBulletList$",
    "$AllServices_WithBulletList$",
    "$AllServicesWithPrice_WithBulletList$",
];

const TotalResulttableVariable = [
    "$AllRecuringResultTotalVariable_WithPackageName$",
    "$AllOneOffResultTotalVariable_WithPackageName$",
    "$AllRecurringResultTotalVariable_WithoutPackageName$",
    "$AllOneOffResultTotalVariable_WithoutPackageName$"
]

export default {
    OnlyForRecurring,
    OnlyForOneOff,
    CombinedTableView,
    CombinedCommaWise,
    CombinedBulletWise,
    TotalResulttableVariable
}