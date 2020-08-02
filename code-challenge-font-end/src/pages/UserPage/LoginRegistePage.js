import React, { useState } from 'react';
import SignUp from '../../components/sign-upComponent/sign-up.component';
import SignIn from '../../components/sign-inComponent/sign-in.component';

const LoginRegisterPage = () => {
  const [signIn, switchMode] = useState(false);
  const onSwitchModeHandler = () => {
    switchMode(!signIn);
  };

  const content = signIn ? (
    <SignUp onChange={onSwitchModeHandler} />
  ) : <SignIn onChange={onSwitchModeHandler} />;

  return (
    <div>

      {content}

    </div>
  );
};

export default LoginRegisterPage;
