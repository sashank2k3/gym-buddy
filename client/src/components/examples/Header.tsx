import Header from '../Header';

export default function HeaderExample() {
  return (
    <div>
      <Header
        userName="John Doe"
        isAdmin={true}
        onLogout={() => console.log('Logout')}
        onManageUsers={() => console.log('Manage users')}
      />
      <div className="p-4">
        <p className="text-muted-foreground">Content below header...</p>
      </div>
    </div>
  );
}
