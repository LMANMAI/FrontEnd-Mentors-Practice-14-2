import { Layout } from "./components";
import { Container, Stack, StackDivider } from "@chakra-ui/react";
import RoutesComponent from "./routes/Routes";
import "./assets/global.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "./features/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./app/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function App(props: any) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  useEffect(() => {
    const token = localStorage.getItem("idCliente");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid === token) {
        const clientRef = doc(db, "users", token);
        const docClient = getDoc(clientRef).then((item) => {
          dispatch(setUser(item.data()));
        });
      }
    });
    return unsubscribe();
  }, [props.history, currentUser]);

  return (
    <Container maxWidth="container.xl" position="relative">
      <Stack spacing={0} divider={<StackDivider />}>
        <Layout>
          <RoutesComponent />
        </Layout>
      </Stack>
    </Container>
  );
}

export default App;
