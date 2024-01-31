import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  console.log('XD');
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') ?? 'signup';

  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Unsuported mode' }, { status: 422 })
  }

  const data = await request.formData();
  const authData = Object.fromEntries(data.entries());
  console.log(authData);
  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: 'Error while ' + mode + ' user' }, { status: 500 })
  }

  
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem('token', token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  console.log(expiration);
  localStorage.setItem('expiration', expiration.toISOString());
  

  return redirect('/');
} 