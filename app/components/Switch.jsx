import { Switch as TwSwitch } from '@headlessui/react';

import { cn } from '~/lib/utils';

const themes = {
  default: {
    switch: 'focus:ring-sapphire-700',
    track: 'bg-white',
    checked: 'bg-sapphire-700',
    unchecked: 'bg-gray-200',
    thumb: 'border-gray-200 bg-white',
  },
  admin: {
    switch: 'focus:ring-sky-600/50 ring-offset-slate-800',
    track: 'bg-transparent',
    checked: 'bg-sky-500',
    unchecked: 'bg-slate-600',
    thumb: 'border-gray-200 bg-gray-100',
  },
};

function Switch({ checked, onChange, theme = 'admin', ...rest }) {
  const classes = themes[theme];

  return (
    <TwSwitch
      checked={checked}
      onChange={onChange}
      className={cn(
        'group',
        'relative',
        'inline-flex items-center justify-center shrink-0',
        'h-5 w-10',
        'cursor-pointer rounded-full',
        'focus:outline-hidden',
        'focus:ring-2 focus:ring-offset-2',
        classes.switch
      )}
      {...rest}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none',
          'absolute',
          'h-full w-full',
          'rounded-md',
          classes.track
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          checked ? classes.checked : classes.unchecked,
          'pointer-events-none',
          'absolute',
          'mx-auto',
          'h-4 w-9',
          'rounded-full',
          'transition-colors duration-200 ease-in-out'
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          checked ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none',
          'absolute left-0',
          'inline-block',
          'h-5 w-5',
          'rounded-full',
          'border',
          'shadow-sm',
          'ring-0',
          'transform',
          'transition-transform duration-200 ease-in-out',
          classes.thumb
        )}
      />
    </TwSwitch>
  );
}

export default Switch;
