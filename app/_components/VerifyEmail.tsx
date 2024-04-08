'use client'
import { onVerifyEmail } from "../_actions/VerifyEmailAction";
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyEmail() {
    const searchParams = useSearchParams()

    const email = searchParams.get('email')
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(true)
    const [result, setResult] = useState('Error verifying your email')

    useEffect(() => {
        const emailVerification = async () => {
            try {
                if (!email || !token) {
                    setResult('Missing required fields');
                    throw new Error('Missing required fields');
                }
                // Update user verification status in database
                let res = await onVerifyEmail(email,token);
            
                if(res.data["error"]){
                    setResult(res.data["error"]);
                }
                else{
                    setResult("Email verified successfully. Please relogin.");
                }
                setIsLoading(false)
            } catch (error) {
                console.error('Error verifying email:', error);
            }
        }
        emailVerification()
    }, [email, token])

    return (
        <>
            <div className='mb-4'>{isLoading ? 'Please wait ...' : result}</div>
            <div className='my-3'>
                <Link href='/' className='bg-white py-3 px-2 rounded'>Back to Login</Link>
            </div>
        </>
    )
}