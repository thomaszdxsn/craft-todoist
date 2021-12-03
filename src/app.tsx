import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Recoil from "recoil";
import * as States from "./states";
import { LoginForm } from "./components";
import { ProjectList } from "./components";
import { ChakraProvider } from "@chakra-ui/react";
import { Container, Stack } from "@chakra-ui/layout";
import { extendTheme } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/skeleton";

const Content: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <Stack>
          <Skeleton width="100%" height="100px" />
          <Skeleton width="100%" height="100px" />
          <Skeleton width="100%" height="100px" />
        </Stack>
      }
    >
      <ProjectList />
    </React.Suspense>
  );
};

const App: React.FC = () => {
  let isLogin = !!Recoil.useRecoilValue(States.apiToken);
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
        },
      })}
    >
      <Container
        minW={260}
        maxW={300}
        width="100%"
        fontSize="md"
        overflowY="auto"
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
