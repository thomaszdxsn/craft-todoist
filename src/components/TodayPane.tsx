import { Stack, StackDivider } from "@chakra-ui/layout";
import React from "react";
import { useRecoilValue } from "recoil";
import TaskCard from "./TaskCard";
import * as States from "../states";

const TodayPane: React.FC = () => {
  const tasks = useRecoilValue(States.taskFamilyByTodayOrOverdue);
  const taskIds = tasks.map((t) => t.id);
  return (
    <Stack divider={<StackDivider borderColor="gray.200" />}>
      {taskIds.map((t) => (
        <TaskCard taskId={t} key={t} />
      ))}
    </Stack>
  );
};

export default TodayPane;
