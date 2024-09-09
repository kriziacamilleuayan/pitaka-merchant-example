import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

import { authKeys } from "./keys";
import { setAuthToken } from "graphQLClient";
import { fetchCurrentUserDetails } from "./services";

export const useGetTokensQuery = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getTokens = async () => {
    const tokens = await getAccessTokenSilently({ detailedResponse: true });
    setAuthToken(tokens.id_token);
    console.log(tokens.id_token);
    return tokens;
  };
  return useQuery({
    queryKey: authKeys.getTokens(),
    queryFn: () => getTokens(),
    enabled: !!isAuthenticated,
  });
};

export const useGetCurrentUserDetailsQuery = () => {
  const { data: tokenData } = useGetTokensQuery();
  const getUserDetails = async () => {
    return await fetchCurrentUserDetails();
  };

  return useQuery({
    queryKey: authKeys.getCurrentUser(),
    queryFn: () => getUserDetails(),
    enabled: Boolean(tokenData),
  });
};
