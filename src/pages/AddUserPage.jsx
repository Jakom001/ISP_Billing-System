import { useUserContext } from "../context/userContext"
import UserForm from "../componnets/AddUserForm";
import {addUser} from "../api/userApi";

const AddUserPage = () => {
    const {setUsers} = useUserContext();

    const handleAddUser = async (userData) => {
        try {
          const { data } = await createUser(userData);
          setUsers((prev) => [...prev, data]);
        } catch (error) {
          console.error("Error adding user:", error);
        }
      };
      return <Add UserForm onSubmit={handleAddUser} />; 
}
export default AddUserPage;