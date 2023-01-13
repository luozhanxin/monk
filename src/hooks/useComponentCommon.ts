import { computed } from "vue";
import { pick } from "lodash-es";
import type { CommonComponentProps } from "../defaultProps";

const useComponentCommon = <T extends CommonComponentProps>(
  props: Readonly<Partial<T>>,
  picks: string[]
) => {
  const styleProps = computed(() => pick(props, picks));
  const handleClick = () => {
    if (props.actionType === "url" && props.url) {
      window.location.href = props.url;
    }
  };
  return {
    styleProps,
    handleClick,
  };
};

export default useComponentCommon;
