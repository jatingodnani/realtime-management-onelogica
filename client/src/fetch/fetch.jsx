export async function getAlltask(setTasks,setLoading,setError){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
    fetch("https://realtime-management-onelogica.vercel.app/task", requestOptions)
    .then((response) => response.json()) 
    .then((result) => {
       
      setTasks(result);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setError(error);
      setLoading(false);
    });
}

export async function fetchSignedInUsers(setsigneduser) {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
      };
  
      const response = await fetch('https://realtime-management-onelogica.vercel.app/api/users', requestOptions);
      const users = await response.json();
     console.log(users)
      setsigneduser([...users])
    } catch (error) {
      console.error('Error fetching signed-in users:', error);
      throw new Error('Failed to fetch signed-in users');
    }
  }

export async function signInUser(userId, email) {
console.log(userId,email)

  try {
   
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, email }),
    };

    const response = await fetch('https://realtime-management-onelogica.vercel.app/api/signin', requestOptions);
    const result = await response.json();
    console.log('Signed in user:', result);
    return result; 
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error('Failed to sign in user');
  }
}

