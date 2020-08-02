import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '../../shared/components/UIElements/Button';
import {
  StyledHeader, Label, StyledForm, TextFieldWrapper, MyTextField,
} from '../../pages/itemPage/NewItemPage';
import AuthContext from '../../shared/utils/context/auth-context';
import useHttpClient from '../../shared/utils/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Your name is too short')
    .required('Please enter your full name'),
  email: Yup.string()
    .email('The email is incorrect')
    .required('Please enter your email'),
  password: Yup.string()
    .concat(Yup.string().required('Password is required'))
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .when('password', (password, schema) => schema.required('Confirm Password is required'))
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const SignUp = (props) => {
  const auth = useContext(AuthContext);

  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();

  return (
    <div>

      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const responseData = await sendRequest(
              process.env.REACT_APP_BACKEND_URL+'/user/signup',
              'POST',
              JSON.stringify({
                name: values.fullName,
                email: values.email,
                password: values.password,
              }),
              {
                'Content-Type': 'application/json',
              },
            );
            auth.login(responseData.userId, responseData.token);
          } catch (err) {}
          // setSubmitting(false); // not sure if I am goon use this or not, read doc for future reference
        }}
      >
        {({
          errors,
          touched,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            <ErrorModal error={error} onClear={clearError} />
            <StyledHeader>
              Make your Own Account!
            </StyledHeader>
            {isLoading && <LoadingSpinner asOverlay />}
            <StyledForm name="contact" method="post" onSubmit={handleSubmit}>
              <TextFieldWrapper>

                <Label htmlFor="fullname">
                  fullName
                  <MyTextField
                    type="text"
                    name="fullName"
                    placeholder="Your FullName"
                    valid={touched.fullName && !errors.fullName}
                    error={touched.fullName && errors.fullName}
                  />
                </Label>

              </TextFieldWrapper>
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
              <TextFieldWrapper>

                <Label htmlFor="password">
                  Confirm Password
                  <MyTextField
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-type your password."
                    valid={touched.email && !errors.email}
                    error={touched.email && errors.email}
                  />
                </Label>

              </TextFieldWrapper>
              <div>
                <Button inverse disabled={isSubmitting} type="submit">
                  Sign Up
                </Button>
                <Button onClick={props.onChange} type="button">
                  Log In
                </Button>

              </div>
            </StyledForm>

          </>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
