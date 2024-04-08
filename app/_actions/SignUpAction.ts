"use server";
import axios from 'axios';
export const submitSignUp = async (prevState: any, formData: FormData) => {
  
  try{
    const email = formData.get("email");
    const name = formData.get("name"); 
    const password = formData.get("password");
    const passwordConfirm = formData.get("confirm-password");

    if(password?.toString() !== passwordConfirm?.toString()){
      return { error: "Password not match!!!" };
    }

    let jsonData: { [key: string]: any } = {
      "email":email,
      "name":name,
      "password":password,
    };
    
    var data = JSON.stringify(jsonData);
    const response = await axios.post('http://localhost:3000/api/auth/signup',data);
    return { data:response.data,error:null };
  }
  catch(err){
    return { error: err };
  }
  };