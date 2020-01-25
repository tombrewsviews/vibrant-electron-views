import { flow, useSetFlow, useFlow } from 'useFlow.js';
import { useMemo } from 'react';
import { useDataHelpers } from 'Data/useData.js';
import intersection from 'utils/intersection.js';
import toCamelCase from 'to-camel-case';
import toPascalCase from 'to-pascal-case';

export default function usePreviousQuestion(baseStory) {
  let dataHelpers = useDataHelpers();
  let flowState = useFlow();
  let setFlow = useSetFlow();
  let flowMapForStory = flow.get(baseStory);

  if (process.env.NODE_ENV === 'development') {
    if (!flowMapForStory) {
      throw new Error(
        `The story "${baseStory}" used as the base story for usePreviousQuestion doesn't exist.`
      );
    }
  }

  return useMemo(() => {
    let flowActiveStory = [
      ...intersection(flowMapForStory.stories, flowState),
    ][0];
    let question = toCamelCase(flowActiveStory.split('/').pop());

    let index = dataHelpers.applicableData.indexOf(question);
    let id = null;
    let value = null;

    let flowStateAsData = toCamelCase(flowActiveStory.split('/').pop());
    let flowStateAsDataIndex = dataHelpers.applicableData.indexOf(
      flowStateAsData
    );
    let prevFlowStateAsData =
      dataHelpers.applicableData[flowStateAsDataIndex - 1];
    // TODO review this, we shouldn't need it
    if (!prevFlowStateAsData) {
      return {
        id: null,
        onClick() {},
        value: null,
      };
    }

    do {
      index--;
      id = dataHelpers.applicableData[index];
      value = dataHelpers.repeaters[`${id}Repeater`];
    } while (!value && index > 0);

    id = toPascalCase(id);
    return {
      id,
      value,
      onClick: () => setFlow(`${baseStory}/${id}`),
    };
  }, [
    baseStory,
    dataHelpers.applicableData,
    dataHelpers.repeaters,
    flowState,
    setFlow,
    flowMapForStory.stories,
  ]);
}
