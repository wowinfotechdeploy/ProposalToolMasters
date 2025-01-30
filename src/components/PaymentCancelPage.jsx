import React, { useContext } from 'react';
import errorImage from "../assets/images/gif/wired-outline-1140-error.gif";
import { Link, useLocation } from 'react-router-dom';
import { AuthContextProvider } from '../AuthContext/AuthContext';
import { useSelector } from 'react-redux';
import { CreateStripeCheckoutSession } from '../redux/Services/Setting/PaymentGatewayApi';

const StripePaymentCanceledPage = () => {
    const { setLoader } =
    useContext(AuthContextProvider); 
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const invoiceKeyID = urlParams.get("invoice-id");
    const common = useSelector((state) => state.Storage);
    const HandleRedirectToPurchase=()=>{
        if(invoiceKeyID !== null){
            CreateStripeCheckoutSessionRedirection(
                common.userKeyID,
                invoiceKeyID
              );
        }
    }
    const CreateStripeCheckoutSessionRedirection = async (
        userKeyID,
        InvoiceKeyID
      ) => {
        setLoader(true);
        try {
          const response = await CreateStripeCheckoutSession(
            userKeyID,
            InvoiceKeyID
          );
          const data = response.data;
    
          if (data.statusCode === 200) {
            setLoader(false);
            const sessionURL = data.responseData.sessionURL;
    
            window.open(sessionURL, "_self");
          } else {
            console.error("Error fetching data from the API");
            setLoader(false);
          }
        } catch (error) {
          console.error("Error fetching data from the API", error);
          setLoader(false);
        }
      };
    return (
        <div className='container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h2>Payment Canceled</h2>
            <div>
                  <img
                    src={errorImage}
                    alt="error_Img"
                    height="100px"
                    width="100px"
                  />
                </div>
            <div className="alert alert-warning" role="alert">
                Your payment was not completed. You can try payment again from your <Link to="/mySubscription">my subscription</Link>
            </div>
            <br/>
            <div>
                <Link to="/" className="btn btn-md btn-success create-item-btn">Dashboard</Link> &nbsp;|&nbsp; 
                <button className="btn btn-md btn-success create-item-btn" onClick={HandleRedirectToPurchase}>Try Payment Again</button>
            </div>
        </div>
    );
}

export default StripePaymentCanceledPage;
