import { trpc } from "../../../trpc/client";

/**
 * Hook for user sign up
 */
export const useSignUp = () => {
  const mutation = trpc.auth.createUserwithEmailAndPassword.useMutation();

  const signUp = async (data: { fullName: string; email: string; password: string }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { signUp, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for user sign in
 */
export const useSignIn = () => {
  const mutation = trpc.auth.signinUserwithEmailAndPassword.useMutation();

  const signIn = async (data: { email: string; password: string }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { signIn, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for getting logged in user
 */
export const useGetLoggedInUser = () => {
  const query = trpc.auth.getLoggedInUser.useQuery(undefined, {
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const mutation = trpc.auth.logoutUser.useMutation();

  const logout = async () => {
    try {
      const result = await mutation.mutateAsync(undefined);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { logout, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};
