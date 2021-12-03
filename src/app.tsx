import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Recoil from "recoil";
import * as States from "./states";
import { AppendButton, LoginForm, TodayPane } from "./components";
import { ChakraProvider } from "@chakra-ui/react";
import { Container, Stack, Box, Flex } from "@chakra-ui/layout";
import { extendTheme } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/skeleton";

const Content: React.FC = () => {
  return (
    <Box>
      <Flex
        fontSize="lg"
        h="44px"
        mb="2"
        boxSizing="border-box"
        justifyContent="center"
        alignItems="center"
      >
        Todoist
      </Flex>
      <React.Suspense
        fallback={
          <Stack>
            <Skeleton width="100%" height="300px" />
          </Stack>
        }
      >
        <AppendButton />
        <TodayPane />
      </React.Suspense>
    </Box>
  );
};

const App: React.FC = () => {
  let [token, setToken] = Recoil.useRecoilState(States.apiToken);
  const isLogin = !!token;
  React.useEffect(() => {
    // craft.storageApi
    //   .get(States.API_TOKEN_KEY)
    //   .then((resp) => resp.data ?? "")
    //   .then((token) => {
    //     setToken(token);
    //   });
    const k = window.localStorage.getItem(States.API_TOKEN_KEY) ?? "";
    setToken(k);
  }, [setToken]);
  if (!isLogin) {
    return <LoginForm />;
  }
  return <Content />;
};

const Wrapper: React.FC = () => {
  return (
    <ChakraProvider
      theme={extendTheme({
        fontSizes: {
          md: "13px",
          sm: "11px",
          lg: "15px",
        },
      })}
    >
      <Container
        minW={260}
        maxW={300}
        width="280"
        fontSize="md"
        overflowY="hidden"
      >
        <Recoil.RecoilRoot>
          <React.Suspense fallback={<Skeleton h="60vh" />}>
            <App />
          </React.Suspense>
        </Recoil.RecoilRoot>
      </Container>
    </ChakraProvider>
  );
};

export function initApp() {
  ReactDOM.render(<Wrapper />, document.getElementById("react-root"));
}
