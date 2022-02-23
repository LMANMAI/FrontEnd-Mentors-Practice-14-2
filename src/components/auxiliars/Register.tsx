import { Stack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { setUser, setError, selectError } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../app/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
const Register = () => {
  const dispatch = useDispatch();
  const errorM = useSelector(selectError);
  const [user, setUserRegister] = useState({
    firstName: "",
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserRegister({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      ).then((userCredential) => {
        dispatch(setUser(userCredential.user));
      });
    } catch (error: any) {
      dispatch(setError(error?.message));
      setTimeout(() => {
        dispatch(setError(""));
      }, 2000);
    }
  };
  return (
    <Stack h="100%" p={4}>
      {errorM && <p>{errorM}</p>}
      <h3>registrate</h3>
      <FormControl as="form" autoComplete="off" onSubmit={handleSubmit}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          onChange={(e) => handleChange(e)}
          name="firstName"
          id="name"
          type="text"
        />

        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          onChange={(e) => handleChange(e)}
          name="email"
          id="email"
          type="email"
        />

        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          onChange={(e) => handleChange(e)}
          name="password"
          type="password"
          id="password"
        />

        <Button
          colorScheme="primary"
          type="submit"
          mt={6}
          w="100%"
          border="none"
          outline="none"
        >
          Registrar
        </Button>
      </FormControl>
    </Stack>
  );
};

export default Register;