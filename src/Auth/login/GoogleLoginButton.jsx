import React, { useContext, useEffect, useState } from 'react';
import GoogleIcon from "../../assets/images/login-with-icon/icon-google-login.webp";
import { gapi } from 'gapi-script';
import { AuthContextProvider } from '../../AuthContext/AuthContext';

// const GoogleLoginButton = ({ handleSocialMediaLogin }) => {
//     const [isClientLoaded, setIsClientLoaded] = useState(false);
//     const { setLoader } = useContext(AuthContextProvider);

//     // Initialize the Google API client
//     useEffect(() => {
//         const initClient = () => {
//             gapi.load('client:auth2', async () => {
//                 try {
//                     await gapi.client.init({
//                         clientId: "532596605778-uqj3qnojmgk9tlcgvmogb02jsb42psin.apps.googleusercontent.com",
//                         scope: 'openid profile email',
//                     });
//                     setIsClientLoaded(true);
//                 } catch (error) {
//                     console.error('Error initializing Google API client:', error);
//                 }
//             });
//         };

//         gapi.load('client:auth2', initClient);

//         // Cleanup on component unmount
//         return () => {
//             gapi.auth2.getAuthInstance()?.signOut();
//         };
//     }, []);

//     // Handle Google login success
//     const handleGoogleSuccess = async (googleUser, idToken) => {
//         setLoader(true);
//         try {
//             const profile = googleUser.getBasicProfile();
//             const SocialRequest_ParamsObj = {
//                 email: profile.getEmail(),
//                 firstName: profile.getGivenName(),
//                 lastName: profile.getFamilyName(),
//                 loginBy: "Google",
//                 tokenID: idToken,
//             };

//             if (SocialRequest_ParamsObj.email) {
//                 await handleSocialMediaLogin(SocialRequest_ParamsObj);
//             } else {
//                 console.error('Email is missing from the Google login response.');
//             }
//         } catch (error) {
//             console.error('Error during Google login success:', error);
//         } finally {
//             setLoader(false);
//         }
//     };

//     // Handle Google login
//     const googleLogin = async () => {
//         setLoader(true);
//         try {
//             const GoogleAuth = gapi.auth2.getAuthInstance();
//             const googleUser = await GoogleAuth.signIn();
//             const idToken = googleUser.getAuthResponse().id_token;
//             // Handle login success
//             await handleGoogleSuccess(googleUser, idToken);
//         } catch (error) {
//             console.error('Error during Google login:', error);
//         } finally {
//             setLoader(false);
//         }
//     };

//     // Show loading state while client is being loaded
//     if (!isClientLoaded) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div
//             style={{ display: 'flex', alignItems: 'center', width: "100%", cursor: 'pointer' }}
//             onClick={googleLogin} // Directly call googleLogin function
//         >
//             <img src={GoogleIcon} height={30} alt="Google" />
//             <span style={{ marginLeft: '10px' }}>
//                 Login with Google
//             </span>
//         </div>
//     );
// };
const GoogleLoginButton = ({ handleSocialMediaLogin }) => {
    const { setLoader } = useContext(AuthContextProvider);

    const handleGoogleSuccess = async (googleUser, idToken) => {
        setLoader(true);
        try {
            const profile = googleUser.getBasicProfile();
            const SocialRequest_ParamsObj = {
                email: profile.getEmail(),
                firstName: profile.getGivenName(),
                lastName: profile.getFamilyName(),
                loginBy: "Google",
                tokenID: idToken,
            };

            if (SocialRequest_ParamsObj.email) {
                await handleSocialMediaLogin(SocialRequest_ParamsObj);
            } else {
                console.error('Email is missing from the Google login response.');
            }
        } catch (error) {
            console.error('Error during Google login success:', error);
        } finally {
            setLoader(false);
        }
    };

    const googleLogin = async () => {
        setLoader(true);
        try {
            await new Promise((resolve, reject) => {
                gapi.load('client:auth2', async () => {
                    try {
                        await gapi.client.init({
                            clientId: "532596605778-uqj3qnojmgk9tlcgvmogb02jsb42psin.apps.googleusercontent.com",
                            scope: 'openid profile email',
                        });
                        resolve();
                    } catch (err) { reject(err); }
                });
            });

            const GoogleAuth = gapi.auth2.getAuthInstance();
            const googleUser = await GoogleAuth.signIn();
            const idToken = googleUser.getAuthResponse().id_token;
            await handleGoogleSuccess(googleUser, idToken);
        } catch (error) {
            console.error('Error during Google login:', error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div
            style={{ display: 'flex', alignItems: 'center', width: "100%", cursor: 'pointer' }}
            onClick={googleLogin}
        >
            <img src={GoogleIcon} height={30} alt="Google" />
            <span style={{ marginLeft: '10px' }}>Login with Google</span>
        </div>
    );
};

export default GoogleLoginButton;
