import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '../../shared/components/UIElements/Button';
import {
  StyledHeader, Label, StyledForm, TextFieldWrapper, MyTextField,
} from '../../pages/itemPage/NewItemPage';
import useHttpClient from '../../shared/utils/hooks/http-hook';
import AuthContext from '../../shared/utils/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('The email is incorrect')
    .required('Please enter your email'),
  password: Yup.string()
    .concat(Yup.string().required('Password is required')),
});

const SignIn = (props) => {
  const auth = useContext(AuthContext);
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const responseData = await sendRequest(
              process.env.REACT_APP_BACKEND_URL+'/user/login',
              'POST',
              JSON.stringify({
                email: values.email,
                password: values.password,
              }),
              {
                'Content-Type': 'application/json',
              },
            );

            auth.login(responseData.userId, responseData.token);
            console.log(auth.userId, auth.token);
          } catch (err) {}
          // setSubmitting(false); // not sure if I am goon use this or not, read doc for future reference
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          isValidating,
          isValid,
        }) => (
          <>

            <StyledHeader>
              Sign in With Your Acctount!
            </StyledHeader>
            {isLoading && <LoadingSpinner asOverlay />}
            <StyledForm name="contact" method="post" onSubmit={handleSubmit}>
              <TextFieldWrapper>

                <Label htmlFor="email">
                  Email
                  <MyTextField
                    type="email"
                    name="email"
                    placeholder="your email"
                    valid={touched.email && !errors.email}
                    error={touched.email && errors.email}
                  />
                </Label>
              </TextFieldWrapper>
              <TextFieldWrapper>

                <Label htmlFor="password">
                  Password
                  <MyTextField
                    type="password"
                    name="password"
                    placeholder="your password"
                    valid={touched.email && !errors.email}
                    error={touched.email && errors.email}
                  />
                </Label>
              </TextFieldWrapper>

              <div>
                <Button inverse disabled={isSubmitting} type="submit">
                  Log In
                </Button>
                <Button onClick={props.onChange} type="button">
                  Sign Up
                </Button>
              </div>
            </StyledForm>

          </>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
