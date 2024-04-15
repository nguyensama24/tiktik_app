import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const createOrGetUser = async (response: any, addUser: any) => {

  const decode: { name: string, picture: string, sub: string } = jwtDecode(response.credential);


  const { name, picture, sub } = decode;

  const user = {
    _id: sub,
    _type: 'user',
    userName: name,
    image: picture,
  }

  addUser(user);

  await axios.post(`http://localhost:3000/api/auth`, user);
}