import { ToastContainer } from 'react-toastify';
import { useTheme } from '../../hooks/useTheme';
import 'react-toastify/dist/ReactToastify.css';

function ToastWrapper() {
  const { isDark } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={2800}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme={isDark ? 'dark' : 'light'}
      toastStyle={{
        borderRadius: 12,
        fontFamily: 'DM Sans, sans-serif',
      }}
    />
  );
}

export default ToastWrapper;
