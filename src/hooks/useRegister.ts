import { useMutation } from "@tanstack/react-query";
import AxiosClient from "../constants/axiosClient";
import {  useNavigate } from "react-router";
import axios from "axios";



export type RegisterForm = {
    email:string;
    password:string;
    password_confirmation:string;
    full_name:string
}

export type RegisterResponse = {
    access_token:string,
    refresh_token:string,
    user:{
     id: number;
     email: string;
     name: string;
    }
}

export function useRegister(){
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async (data:RegisterForm): Promise<RegisterResponse> =>{
            const res = await AxiosClient.post<RegisterResponse>(
                'auth/register',
                data
            )
            return res
        },
        onSuccess: (data)=>{
            console.log("Register successfully",data);
            navigate("/signin")
        },
         onError: (error) => {
            if (axios.isAxiosError(error)) {
                throw error.response?.data;
            }
            throw error;
        },
    })
}