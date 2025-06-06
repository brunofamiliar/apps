import type { ReactElement } from 'react';
import React from 'react';
import classNames from 'classnames';
import { ClickableText } from '../buttons/ClickableText';

interface ClassName {
  container?: string;
  login?: string;
}

interface MemberAlreadyProps {
  className?: ClassName;

  onLogin(): void;
}

export function MemberAlready({
  className = {},
  onLogin,
}: MemberAlreadyProps): ReactElement {
  return (
    <span className={classNames('flex items-center', className?.container)}>
      Already have an account?
      <ClickableText
        className={classNames('ml-1', className?.login)}
        onClick={onLogin}
        inverseUnderline
      >
        Log in
      </ClickableText>
    </span>
  );
}
