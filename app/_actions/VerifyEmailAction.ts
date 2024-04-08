"use server";
import axios from 'axios';
export const onVerifyEmail = async (email:string,token:string ) => {
  
  try{
    let jsonData: { [key: string]: string } = {
      "email":email,
      "emailVerifToken":token,
    };
    
    var data = JSON.stringify(jsonData);
    const response = await axios.patch('http://localhost:3000/api/auth/verify',data);
    return { data:response.data,error:null};
  }
  catch(err){
    return { error: err };
  }
  };