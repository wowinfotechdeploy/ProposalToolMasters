import { saveImage } from "../../../Base-Url/Base_Url";
import { postApiWithAuthenticated, } from "../../reducer/reduxService";

// Arrow function as a method
//SaveImage 
export const GetSaveImage = async (params) => {
    const res = await postApiWithAuthenticated(saveImage, (params));
    return res;
};


