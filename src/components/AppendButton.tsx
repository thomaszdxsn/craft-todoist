import React from "react";
import { Button } from "@chakra-ui/button";
import { SmallAddIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import * as States from "../states";
import { useToast } from "@chakra-ui/toast";
import { CraftBlock, CraftTextBlock } from "@craftdocs/craft-extension-api";

const AppendButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const add = States.useAddTask();
  const [isLoading, setIsLoading] = React.useState(false);
  const onClick = () => {
    setIsLoading(true);
    craft.editorApi
      .getSelection()
      .then((resp) => {
        if (!resp.data?.length) {
          throw new Error();
        }
        return resp.data;
      })
      .catch((e) => {
        toast({
          status: "error",
          position: "bottom",
          title: "You are select nothing",
          duration: 1000,
        });
        return [] as CraftBlock[];
      })
      .then((blocks) => {
        if (!blocks.length) {
          return;
        }
        return Promise.all(
          blocks
            .filter(
              (block): block is CraftTextBlock => block.type === "textBlock"
            )
            .map((block) => {
              const description = `craftdocs://open?spaceId=${block.spaceId}&blockId=${block.id}`;
              return add({ description, content: block.content.join("") });
            })
        ).then((_) =>
          toast({ position: "bottom", title: "Create Successfully!" })
        );
      })
      .catch(() =>
        toast({
          status: "error",
          position: "bottom",
          title: "Server Error",
          duration: 1000,
        })
      )

      .finally(() => {
        setIsLoading(false);
      });
  };
  {
    /* <Select>
        {projectList.map((project) => (
          <option value={project.id}>{project.name}</option>
        ))}
      </Select> */
  }
  return (
    <Button
      leftIcon={<SmallAddIcon />}
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Connect
    </Button>
  );
};

export default AppendButton;
