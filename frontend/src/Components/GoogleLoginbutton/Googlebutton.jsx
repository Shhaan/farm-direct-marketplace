import GoogleButton from "react-google-button";
import {Api_base,GOOGLE_OAUTH2_CLIENT_ID,GOOGLE_OAUTH2_CLIENT_SECRET} from '../../Config/Constants'
import axios from '../../Config/Axios'
const onGoogleLoginSuccess = async (farmer,login) => {
  const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const REDIRECT_URI = 'google/auth/api/login/';

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const params = {
    response_type: 'code',
    client_id: GOOGLE_OAUTH2_CLIENT_ID,
    redirect_uri: `${Api_base}${REDIRECT_URI}`,
    prompt: 'select_account',
    access_type: 'offline',
    scope
  }

   
  
  
  const urlParams = new URLSearchParams(params).toString();
  window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
};

export default onGoogleLoginSuccess