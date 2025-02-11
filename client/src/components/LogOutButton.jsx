const LogoutButton = () => {
    const { setIsAuthenticated } = useAuth();
  
    const handleLogout = async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include', // Include cookies in the request
        });
  
        if (!response.ok) {
          throw new Error('Logout failed');
        }
  
        // Update authentication state
        setIsAuthenticated(false);
  
        console.log('Logged out successfully');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
  
    return (
      <button onClick={handleLogout}>Logout</button>
    );
  };