import * as Recoil from "recoil";
import { TodoistApi, Project } from "@doist/todoist-api-typescript";

const API_TOKEN_KEY = "API_TOKEN";

const globalScopeClient: { current?: TodoistApi } = { current: undefined };

export const apiToken = Recoil.atom({
  key: "apiToken",
  default: craft.storageApi
    .get(API_TOKEN_KEY)
    .then((resp) => resp.data ?? "ac2e347353de1027e28754dcdd723f8d8b7c813d"),
});

export const client = Recoil.atom<TodoistApi | undefined>({
  key: "client",
  default: Recoil.selector({
    key: "client:default",
    get: ({ get }) => {
      const token = get(apiToken);
      if (token) {
        globalScopeClient.current = new TodoistApi(token);
        return globalScopeClient.current;
      }
      return undefined;
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        globalScopeClient.current = newValue;
      });
    },
  ],
});

export const projects = Recoil.atom<Project[]>({
  key: "projects",
  default: Recoil.selector({
    key: "projects:default",
    get: ({ get }) => {
      const cli = get(client);
      if (!cli) return [];
      return cli.getProjects();
    },
  }),
});

export const useLoginCallback = () =>
  Recoil.useRecoilCallback(({ set }) => {
    return async (token: string) => {
      let cli = new TodoistApi(token);
      return cli.getProjects().then((pjs) => {
        set(projects, pjs);
        set(apiToken, token);
        set(client, cli);
      });
    };
  });
