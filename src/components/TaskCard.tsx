import { IconButton } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { CopyIcon, DeleteIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import {
  useRecoilValue,
  useRecoilState,
  useRecoilRefresher_UNSTABLE,
} from "recoil";
import * as States from "../states";

const TaskCard: React.FC<{ taskId: number }> = ({ taskId }) => {
  const [task, setTask] = useRecoilState(States.taskFamily(taskId));
  const projectsDict = useRecoilValue(States.projectsDict);
  const client = useRecoilValue(States.client);
  const refresh = useRecoilRefresher_UNSTABLE(
    States.taskFamilyByTodayOrOverdue
  );
  const toggleTaskCompelte = (value: boolean) => {
    setTask((prev) => ({ ...prev, completed: value }));
  };
  const onDuplicateToBlocks = () => {
    craft.dataApi.addBlocks([
      craft.blockFactory.textBlock({
        listStyle: { type: "todo", state: "unchecked" },
        content: [
          { text: task.content + "\n" },
          { text: "open in todoist", link: { type: "url", url: task.url } },
        ],
      }),
    ]);
  };
  const onDelete = () => {
    client!.deleteTask(taskId).then(() => refresh());
  };
  return (
    <Box isTruncated minH="25px" p="2">
      <Checkbox
        checked={task.completed}
        onChange={(e) => toggleTaskCompelte(e.target.checked)}
      >
        <Tooltip label={task.content} placement="top">
          <Text>{task.content}</Text>
        </Tooltip>
      </Checkbox>
      <Flex justifyContent="space-between" alignItems="baseline">
        <Text>##{projectsDict[task.projectId].name}</Text>
        <Flex alignItems="center" gridGap="1" py="1">
          <IconButton
            aria-label="copy"
            icon={<CopyIcon />}
            size="xs"
            onClick={onDuplicateToBlocks}
          />
          <IconButton
            aria-label="link"
            icon={<LinkIcon color="blue.200" />}
            size="xs"
            onClick={() =>
              // The Url scheme like todoist://task?id=<id> only work on iOS
              // Can't open url scheme in MacOS，So take web url as fallback
              craft.editorApi.openURL(task.url)
            }
          />
          <IconButton
            aria-label="delete"
            icon={<DeleteIcon color="red.200" />}
            size="xs"
            onClick={() => onDelete()}
          />
        </Flex>
      </Flex>
      <Text size="sm" whiteSpace="pre-wrap">
        {task.description}
      </Text>
    </Box>
  );
};

export default TaskCard;
