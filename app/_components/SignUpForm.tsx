"use client";
import React, { useRef ,useEffect} from "react";
import { submitSignUp } from "../_actions/SignUpAction";
// import SubmitButton from "./SubmitButton";
// import ResetButton from "./ResetButton";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
type Props = {};

export default function SignUpForm({}: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitSignUp, { error: null, data:null});
  const router = useRouter();

  useEffect(() => {
    if(state.error == null && state.data != null){
      router.push("/");
    }
  },[state]);
  return (
    <form 
      ref={ref}
      action={async (formData: FormData) => {
        formAction(formData);
        console.log(state)
      }}
      className="mx-auto mt-8 max-w-xl sm:mt-8">
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
    <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
          Email
        </label>
        <div className="mt-2.5">
          <input
            type="text"
            name="email"
            id="email"
            autoComplete="organization"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    <div className="sm:col-span-2">
        <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
          Name
        </label>
        <div className="mt-2.5">
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="organization"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
          Password
        </label>
        <div className="mt-2.5">
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="password"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="confirm-password" className="block text-sm font-semibold leading-6 text-gray-900">
          Confirm Password
        </label>
        <div className="mt-2.5">
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            autoComplete="confirm-password"
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    <div className="mt-10">
      <button
        type="submit"
        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Sign Up
      </button>
    </div>
  </form>
  );
}