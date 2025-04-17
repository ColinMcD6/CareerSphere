interface ErrorMessageProps {
    message: string;
  }
  
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return <div className="alert alert-danger mt-2">{message}</div>;
  };
  
    export default ErrorMessage;