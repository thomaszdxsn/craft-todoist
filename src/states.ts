import * as Recoil from "recoil";
import { TodoistApi, Project, Task } from "@doist/todoist-api-typescript";

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

export const projectsDict = Recoil.selector({
  key: "projects:dict",
  get: ({ get }) => Object.fromEntries(get(projects).map((p) => [p.id, p])),
});

export const taskFamily = Recoil.atomFamily<Task, number>({
  key: "task:family",
  default: (id) => globalScopeClient.current!.getTask(id),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newVal, oldValue) => {
        const old = oldValue as Task;
        const done = !old.completed && newVal.completed;
        const undo = old.completed && !newVal.completed;
        const cmds = [];
        if (done) {
          cmds.push(globalScopeClient.current!.closeTask(newVal.id));
        }
        if (undo) {
          cmds.push(globalScopeClient.current!.reopenTask(newVal.id));
        }
        cmds.push(globalScopeClient.current!.updateTask(old.id, newVal));
        return Promise.all(cmds);
      });
    },
  ],
});

export const taskFamilyByProject = Recoil.selectorFamily<Task[], string>({
  key: "task:family:byProject",
  get:
    (projectName) =>
    ({ get }) =>
      get(client)!.getTasks({ filter: `##${projectName}` }),
});

export const taskFamilyByTodayOrOverdue = Recoil.selector<Task[]>({
  key: "task:family:byProject",
  get: ({ get }) => get(client)!.getTasks({ filter: `today|overdue` }),
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

export const useAddTask = () => {
  return Recoil.useRecoilCallback(({ snapshot, set }) => {
    return async (params: {
      projectId?: number;
      content: string;
      description?: string;
    }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const resp = await cli.addTask(params);
      set(taskFamily(resp.id), resp);
      return resp;
    };
  });
};

// can't use this endpoint because it required oauth authentication, otherwise it throw a cors error
export const useQuickAddTask = () => {
  return Recoil.useRecoilCallback(({ snapshot, set }) => {
    return async (params: { text: string; note?: string }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const resp = await cli.quickAddTask(params);
      set(taskFamily(resp.id), resp);
      return resp;
    };
  });
};
