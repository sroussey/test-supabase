'use client';

import React, { useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export const SigninChoices = () => {
  const [message, setMessage] = useState({ type: '', content: '' });
  const supabaseClient = createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  };

  const handleSignin: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setMessage({ type: '', content: '' });

    const provider = event.currentTarget.dataset.provider as Provider;

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL(),
      },
    });
    if (error) {
      setMessage({ type: error.name, content: error.message });
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-center pb-12 ">Signin with one of the following:</div>
      <div className="flex flex-col gap-4">
        {['google', 'twitter', 'linkedin'].map((provider) => {
          return (
            <button
              type="button"
              key={provider}
              className="flex items-center justify-center border rounded border-brand-300 hover:border-brand-400 hover:bg-brand-200"
              data-provider={provider}
              onClick={handleSignin}
            >
               Sign in with {provider}
            </button>
          );
        })}
      </div>
    </>
  );
};
