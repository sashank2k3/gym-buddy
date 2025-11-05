import LoginForm from '../LoginForm';

export default function LoginFormExample() {
  return <LoginForm onLogin={(user, pass) => console.log('Login:', user, pass)} />;
}
