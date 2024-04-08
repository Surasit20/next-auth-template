import VerifyEmail from "../../_components/VerifyEmail";
import { Suspense } from "react";

export default function Verify() {
  return (
    <Suspense>
      <div className='flex flex-col'>
        <VerifyEmail />
      </div>
    </Suspense>
  )
}
