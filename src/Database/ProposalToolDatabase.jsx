export const GetCountryLookUpList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          countryId: 1,
          countryName: "United Kingdom",
        },
        {
          countryId: 2,
          countryName: "Great Britain",
        },
        {
          countryId: 3,
          countryName: "England",
        },
        {
          countryId: 4,
          countryName: "Northern Ireland",
        },
        {
          countryId: 5,
          countryName: "Scotland",
        },
        {
          countryId: 6,
          countryName: "Wales",
        },
      ],
    },
  },
};

export const CurrencyTypeLookUpList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          currencyId: 1,
          currencyName: "GBP",
        },
      ],
    },
  },
};
export const EmailLookUpList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          emailTypeId: 1,
          emailTypeName: 'BT Internet',
        },
        {
          emailTypeId: 2,
          emailTypeName: 'Gmail',
        },
        {
          emailTypeId: 3,
          emailTypeName: 'Hotmail',
        },
        {
          emailTypeId: 4,
          emailTypeName: 'Microsoft',
        },
        {
          emailTypeId: 5,
          emailTypeName: "Microsoft Exchange Server",
        },
        {
          emailTypeId: 6,
          emailTypeName: "Office 365",
        },
        {
          emailTypeId: 7,
          emailTypeName: 'Yahoo',
        },
        {
          emailTypeId: 8,
          emailTypeName: 'Other',
        }
      ],
    },
  },
};
export const GetDriverTypeLookUpList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          driverTypeId: 2,
          driverTypeName: "Quantity",
        },
        {
          driverTypeId: 3,
          driverTypeName: "Variation",
        },
        {
          driverTypeId: 4,
          driverTypeName: "Slab",
        },
      ],
    },
  },
};

export const ProfessionTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          professionTypeId: 1,
          professionTypeName: "Accountancy/Tax/Payroll/Bookkeeping",
        },
        {
          professionTypeId: 2,
          professionTypeName: "Other",
        },
      ],
    },
  },
};

export const BusinessTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          businessTypeID: 1,
          businessTypeName: "Individual",
        },
        {
          businessTypeID: 2,
          businessTypeName: "Sole Trader",
        },
        {
          businessTypeID: 3,
          businessTypeName: "Partnership",
        },
        {
          businessTypeID: 4,
          businessTypeName: "LLP",
        },
        {
          businessTypeID: 5,
          businessTypeName: "Ltd",
        },
      ],
    },
  },
};

export const NOBTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          businessNatureID: null,
          businessNatureName: "All",
        },
        {
          businessNatureID: 1,
          businessNatureName: "Restaurant/Hotel/Bar/Travel",
        },
        {
          businessNatureID: 2,
          businessNatureName: "Construction/Development",
        },
        {
          businessNatureID: 3,
          businessNatureName: "Rental (Property)",
        },
        {
          businessNatureID: 4,
          businessNatureName: "Home Services/Construction Trades",
        },
        {
          businessNatureID: 5,
          businessNatureName: "Professional/IT Services",
        },
        {
          businessNatureID: 6,
          businessNatureName: "E-commerce/Retailers/Trading",
        },
        {
          businessNatureID: 7,
          businessNatureName: "Other",
        },
      ],
    },
  },
};

export const DriverTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          driverTypeId: 2,
          driverTypeName: "Quantity",
        },
        {
          driverTypeId: 3,
          driverTypeName: "Variation",
        },
        {
          driverTypeId: 4,
          driverTypeName: "Slab Based",
        },
      ],
    },
  },
};

export const AdminRoleTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        // {
        //   "roleTypeId": 1,
        //   "roleName": "Super Admin"
        // },
        {
          roleTypeId: 2,
          roleName: "Admin",
        },
      ],
    },
  },
};

export const SuperAdminRoleTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          roleTypeId: 1,
          roleName: "Super Admin",
        },
        {
          roleTypeId: 2,
          roleName: "Admin",
        },
        {
          roleTypeId: 3,
          roleName: "Support",
        },
      ],
    },
  },
};

export const SlabTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          slabTypeId: 1,
          slabTypeName: "Slab Block",
        },
        {
          slabTypeId: 2,
          slabTypeName: "Incremental Slab",
        },
      ],
    },
  },
};

export const ServiceChargeTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          serviceChargeTypeID: 1,
          serviceChargeTypeName: "Reccuring",
        },
        {
          serviceChargeTypeID: 2,
          serviceChargeTypeName: "One Off",
        },
        {
          serviceChargeTypeID: 3,
          serviceChargeTypeName: "Both Reccuring & One Off",
        },
        {
          serviceChargeTypeID: 4,
          serviceChargeTypeName: "Package Only",
        },
      ],
    },
  },
};

export const PricingTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          pricingTypeID: 1,
          pricingTypeName: "Fixed Price",
        },
        {
          pricingTypeID: 2,
          pricingTypeName: "Formula Based Pricing",
        },
      ],
    },
  },
};

export const TemplateTypeCategoriesLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          templateTypeCatID: 1,
          templateTypeCatName: "Master Template",
        },
        {
          templateTypeCatID: 2,
          templateTypeCatName: "Terms and conditions Template",
        },
        {
          templateTypeCatID: 3,
          templateTypeCatName: "Email Template",
        },
      ],
    },
  },
};

export const TemplateElementTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          templateElementTypeID: 10,
          templateElementTypeName: "First Page",
        },

        {
          templateElementTypeID: 1,
          templateElementTypeName: "Heading",
        },
        {
          templateElementTypeID: 2,
          templateElementTypeName: "Text Block",
        },
        {
          templateElementTypeID: 3,
          templateElementTypeName: "Service Pricing Table",
        },
        {
          templateElementTypeID: 4,
          templateElementTypeName: "Service Descriptions",
        },
        {
          templateElementTypeID: 5,
          templateElementTypeName: "Full Page Heading",
        },
        {
          templateElementTypeID: 6,
          templateElementTypeName: "Page Break",
        },
        {
          templateElementTypeID: 7,
          templateElementTypeName: "Signature Block (Only for Contract)",
        },
        {
          templateElementTypeID: 8,
          templateElementTypeName: "Statement of facts",
        },
        {
          templateElementTypeID: 9,
          templateElementTypeName: "PDF",
        },
        {
          templateElementTypeID: 11,
          templateElementTypeName: "Terms & Conditions",
        },
      ],
    },
  },
};

export const IncorporatedInLookUpList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          incInID: 1,
          incInName: "England & Wales (EW)",
        },
        {
          incInID: 2,
          incInName: "Northern Ireland (NI)",
        },
        {
          incInID: 3,
          incInName: "Scotland (SC)",
        },
        {
          incInID: 4,
          incInName: "Wales (WA)",
        },
      ],
    },
  },
};

export const QuoteTypeLookupList = {
  data: {
    statusCode: 200,
    errorMessage: null,
    totalCount: 0,
    responseData: {
      data: [
        {
          quoteTypeID: 1,
          quoteTypeName: "Packaged (Customizable) (Single/Multiple)",
        },
        {
          quoteTypeID: 2,
          quoteTypeName: "Packaged (Standard) (Single/Multiple)",
        },
        {
          quoteTypeID: 3,
          quoteTypeName: "Custom (Single)",
        },
      ],
    },
  },
};

export const TemplateAvailable =
{
  "statusCode": 200,
  "errorMessage": null,
  "totalCount": 0,
  "responseData": {
    "data": null
  }
}


export const Template =
{
  "statusCode": 200,
  "errorMessage": null,
  "totalCount": 0,
  "responseData": {
    "templateKeyID": "cf241ce7-1c9e-4dcb-bffb-7795a8a5c089\n",
    "clientKeyID": 76,
    "data": {
      "templateElementListWithRequiredData": {
        "brandColor": "red",
        "documentCode": "290365"
      },
      "templateElementList": [
        {
          "ttetMapID": 70216,
          "templateElementTypeID": 10,
          "headings": null,
          "shortDesc": null,
          "htmlContent": "\n                      <p style=\"text-align: center;   color: #00BFFF;\">\n                        <span style=\"color: rgb(0, 191, 255); margin-top: 15px; font-size: 50px;\">Proposal For</span><br>\n                       \n                      </p>\n                      <p style=\"page-break-after: always;\"><strong style=\"background-color: rgb(255, 255, 255); font-size: 16px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;$Client.FirstName$&nbsp;$Client.LastName$</strong></p>\n                    ",
          "documentCode": null
        },
        {
          "ttetMapID": 9886,
          "templateElementTypeID": 2,
          "headings": null,
          "shortDesc": null,
          "htmlContent": "<p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"></p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"></p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">16 May 2024</p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">To,<br>Ind Dual<br>Waltham Cross,<br> Enfield,<br> Greater London,<br> EN8 8EU</p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">Dear Ind,</p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">Based on your requirements and information provided we have estimated the following quote. Please review it and confirm it.</p>"
        },
        {
          "ttetMapID": 9887,
          "templateElementTypeID": 2,
          "headings": null,
          "shortDesc": null,
          "htmlContent": "<p><span style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\">Quote for the custom package is based on the facts you have given below. We've based our quote on the following facts, if these are not true please do let us know and we'll provide a revised quote. During our engagement if you exceed these brackets we will need to revisit our quote and adjust accordingly. We'll be sure to keep you informed.</span></p>"
        },
        {
          "ttetMapID": 9888,
          "templateElementTypeID": 1,
          "headings": "Service Description",
          "shortDesc": null,
          "htmlContent": null
        },
        {
          "ttetMapID": 9889,
          "templateElementTypeID": 2,
          "headings": null,
          "shortDesc": null,
          "htmlContent": "<p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\"><strong>Payment Terms</strong></p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">Payments by Direct Debit will be collected on the 07th or 20th of each month depending on the invoicing date. For Adhoc charges, 50% advance payment. This Agreement may be terminated by either party by giving three month’s written notice at any time. Any services that have not been paid for will become immediately due and owing. Where there is any inconsistency between this agreement and the attached Terms &amp; Conditions, the terms of this agreement shall apply.</p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">We trust that all is in order but if you need any further information please let us know. We look forward to hearing from you soon.</p><p style=\"color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\">Yours Sincerely,<br>INFORMA UK LIMITED</p>"
        },
        {
          "ttetMapID": null,
          "templateElementTypeID": 6,
          "headings": null,
          "shortDesc": null,
          "htmlContent": null
        },
        {
          "ttetMapID": null,
          "templateElementTypeID": 4,
          "headings": null,
          "shortDesc": null,
          "htmlContent": null
        },
        {
          "ttetMapID": null,
          "templateElementTypeID": 3,
          "headings": null,
          "shortDesc": null,
          "htmlContent": null
        },
        {
          "ttetMapID": null,
          "templateElementTypeID": 8,
          "headings": null,
          "shortDesc": null,
          "htmlContent": null
        },
        {
          "ttetMapID": null,
          "templateElementTypeID": 6,
          "headings": null,
          "shortDesc": null,
          "htmlContent": null
        }
      ]
    }
  }
}