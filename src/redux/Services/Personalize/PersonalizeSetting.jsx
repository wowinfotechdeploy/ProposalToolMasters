import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated, postApiWithAuthenticated,
} from "../../reducer/reduxService";
const personalizeUrl = `${Base_Url}/UserPersonalizeSetting`;
//..............................Profession Type Services Callback function.................................

export const GetUserPersonalizeSetting = async (id) => {
    const res = await getListWithAuthenticated(`${personalizeUrl}/GetThemeSettingLookupList?UserKeyID=${id}`);
    return res;
};

// export const GetUpdateThemeSettings = async (id,organisationKeyID, param) => {
    
//     const res = await postApiWithAuthenticated(`${personalizeUrl}/UpdateThemeSettings?UserKeyID=${id}&OrganisationKeyID=${organisationKeyID}`, param);
//     return res;
// };


export const GetUpdateThemeSettings = async (id, organisationKeyID,SettingType, param) => {

  if (!SettingType || (SettingType !== 'PersonalizeSetting' && SettingType !== 'Appearance')) {
    throw new Error('Invalid SettingType');
  }

  let url = `${personalizeUrl}/UpdateThemeSettings?UserKeyID=${id}&SettingType=${SettingType}`;

  if (organisationKeyID && organisationKeyID.trim() !== '') {
    url += `&OrganisationKeyID=${organisationKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, param);
  return res;
    // let url = `${personalizeUrl}/UpdateThemeSettings?UserKeyID=${id}`;
  
    // if (organisationKeyID && organisationKeyID.trim() !== '') {
    //   url += `&OrganisationKeyID=${organisationKeyID}`;
    // }
  
    // const res = await postApiWithAuthenticated(url, param);
    // return res;
  };