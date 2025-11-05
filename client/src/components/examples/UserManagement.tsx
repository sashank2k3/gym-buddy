import UserManagement from '../UserManagement';

export default function UserManagementExample() {
  const users = [
    { username: 'admin', name: 'Admin User' },
    { username: 'john', name: 'John Doe' },
    { username: 'jane', name: 'Jane Smith' },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <UserManagement
        users={users}
        onCreateUser={(u, p, n) => console.log('Create:', u, p, n)}
        onDeleteUser={(u) => console.log('Delete:', u)}
      />
    </div>
  );
}
