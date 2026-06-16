import { ActionIcon, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';

const ScrollToTop = () => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Transition transition="slide-up" duration={200} mounted={scroll.y > 300}>
      {(transitionStyles) => (
        <ActionIcon
          style={transitionStyles}
          size="lg"
          color="brightSun.4"
          variant="filled"
          radius="xl"
          onClick={() => scrollTo({ y: 0 })}
          className="fixed bottom-[110px] right-5 z-[100] shadow-lg shadow-bright-sun-400/20 sm-mx:!bottom-[150px]"
        >
          <IconArrowUp size={20} className="text-mine-shaft-950" />
        </ActionIcon>
      )}
    </Transition>
  );
};

export default ScrollToTop;
