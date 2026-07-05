import { ActionIcon, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';

const ScrollToTop = () => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Transition transition="slide-up" duration={300} mounted={scroll.y > 300}>
      {(transitionStyles) => (
        <ActionIcon
          style={{ ...transitionStyles, zIndex: 2000 }}
          size={50}
          color="brightSun.4"
          variant="filled"
          radius="100%"
          onClick={() => scrollTo({ y: 0 })}
          className="fixed bottom-8 right-8 sm-mx:bottom-28 sm-mx:right-4 shadow-[0_8px_30px_rgba(250,204,21,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(250,204,21,0.5)] transition-all duration-300"
          aria-label="Scroll to top"
        >
          <IconArrowUp size={24} className="text-mine-shaft-950" stroke={2.5} />
        </ActionIcon>
      )}
    </Transition>
  );
};

export default ScrollToTop;
