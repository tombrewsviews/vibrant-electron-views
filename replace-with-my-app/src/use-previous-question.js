import { flow, useSetFlow, useFlow } from 'useFlow.js';
import { useMemo } from 'react';
import { useDataHelpers } from 'Data/useData.js';
import intersection from 'utils/intersection.js';
import toCamelCase from 'to-camel-case';
import toPascalCase from 'to-pascal-case';

let flowMapForStory = flow.get('/App/Onboarding/ProvideData');

let usePreviousQuestion = () => {
  let dataHelpers = useDataHelpers();
  let flowState = useFlow();
  let setFlow = useSetFlow();

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
      onClick: () => setFlow(`/App/Onboarding/ProvideData/${id}`),
    };
  }, [dataHelpers.applicableData, dataHelpers.repeaters, flowState, setFlow]);
};

export default usePreviousQuestion;
