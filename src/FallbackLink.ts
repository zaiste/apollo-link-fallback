import { HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context"

const setCacheLink = setContext(() => ({ version: "cache" }));

const networkErrorLink = onError(
  ({ networkError, operation, forward }) => {
    if (networkError) {
      operation.setContext({ version: "upstream" });
      return forward(operation);
    }
  }
);

interface FallbackLinkInput {
  cacheURI: string;
  upstreamURI: string;
}

export const FallbackLink = ({ cacheURI, upstreamURI }: FallbackLinkInput) =>
  from([setCacheLink, networkErrorLink]).split(
    (operation) => operation.getContext().version === "cache",
    new HttpLink({ uri: cacheURI }),
    new HttpLink({ uri: upstreamURI })
  );



