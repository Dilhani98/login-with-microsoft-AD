import React from "react";
import { useCallback, useState } from 'react';
import { PageLayout } from "./Components/PageLayout";
//import ProfileContent from "./Components/ProfileContent";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import Button from "react-bootstrap/Button";
import axios, { Axios } from "axios"; 
/*const axiosInstance =  axios.create({
  baseURL: "http://localhost:7297/api/Function1",
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer ${acc}',
    'Content-Type': 'application/json'
  }
});
*/


function App() {
  return (
      <PageLayout>
          <AuthenticatedTemplate>
              <ProfileContent />
              
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
              <p>You are not signed in! Please sign in.</p>
          </UnauthenticatedTemplate>

      </PageLayout>
  );


}
export default App;

function ProfileContent() {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState(null);

  const name = accounts[0] && accounts[0].name;

  function RequestAccessToken() {
      const request = {
          ...loginRequest,
          account: accounts[0]
      };

      // Silently acquires an access token which is then attached to a request for Microsoft Graph data
      instance.acquireTokenSilent(request).then((response) => {
          setAccessToken(response.accessToken);
      }).catch((e) => {
          instance.acquireTokenPopup(request).then((response) => {
              setAccessToken(response.accessToken);
          });
      });
  }
console.log(accessToken)
const axiosInstance =  axios.create({
  baseURL: "http://localhost:7297/api/Function1",
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
/*
const fetchData = useCallback( async () =>{
  try{
  
  const result = await axiosInstance.get('http://localhost:7297/api/Function1', "niroshika");
 // setUsers(result.data);
  console.log(result);

  }catch(err){
    
        console.log(err);
  }
});*/

const fetchData = useCallback( async()=>{ axiosInstance.get (
  'http://localhost:7175/api/Function1'

) .then((response) => {
  console.log(response)
}).catch();
});
  return (
      <>
          <h5 className="card-title">Welcome {name}</h5>
          {accessToken ? 
              <p>Access Token Acquired!</p>
              :
              <Button variant="secondary" onClick={RequestAccessToken}>Request Access Token</Button>
          }
          <button onClick={fetchData}>Call Api</button>
      </>
  );
};