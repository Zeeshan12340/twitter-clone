import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UseUserInfo() {
    const {data: Session, status} = useSession();
    const [userInfo, setUserInfo] = useState(null);
  
    async function getUserInfo() {
      if (status === 'loading') return;
      if (Session === null) return;
      fetch('/api/users?id=' + Session.user.id)
        .then(response => response.json())
        .then(data => {
          setUserInfo(data.user);
        })
    }

    useEffect(() => {
      getUserInfo();
    }, [status])

    return {userInfo, setUserInfo, status}
}