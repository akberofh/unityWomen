import { apiSlice } from "./apiSlice";
const USERS_URL = '/api/users'

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            })
            
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            })
        }),
        getReferralCode: builder.mutation({
            query: (referralCode) => ({
              url: `https://unity-women-backend.vercel.app/api/users/admin/${referralCode}`,
              method: 'GET',  // POST isteği kullanıyoruz, veri gönderiyoruz
              body: { referralCode },
            }),
          }),

    }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation, useGetReferralCodeMutation } = userApiSlice;
