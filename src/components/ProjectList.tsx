import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "@chakra-ui/accordion";
import { AccordionPanel } from "@chakra-ui/accordion";
import { AccordionButton } from "@chakra-ui/accordion";
import { AccordionIcon } from "@chakra-ui/accordion";
import { Badge, Box, Stack, StackDivider } from "@chakra-ui/layout";
import React from "react";
import { useRecoilValue } from "recoil";
import * as States from "../states";
import { translateColorNumber } from "../utils";
import TaskCard from "./TaskCard";

const ProjectTaskPane: React.FC<{ name: string }> = ({ name }) => {
  const tasks = useRecoilValue(States.taskFamilyByProject(name));
  const taskIds = tasks.map((task) => task.id);
  if (taskIds.length === 0) {
    return null;
  }
  return (
    <Stack divider={<StackDivider borderColor="gray.200" />}>
      {taskIds.map((t) => (
        <TaskCard taskId={t} key={t} />
      ))}
    </Stack>
  );
};

const ProjectList: React.FC = () => {
  const projectList = useRecoilValue(States.projects);
  return (
    <Accordion allowToggle>
      {projectList
        .map(
          // avoid mutable recoil state
          (x) => x
        )
        .sort((a, b) => ((a.order ?? 0) < (b.order ?? 0) ? -1 : 1))
        .map((project) => (
          <AccordionItem key={project.id}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Badge color={translateColorNumber(project.color)}>
                  {project.name}
                </Badge>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <ProjectTaskPane name={project.name} />
            </AccordionPanel>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default ProjectList;
