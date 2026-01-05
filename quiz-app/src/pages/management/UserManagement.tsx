import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUser';
import type { CreateUserDto, UpdateUserDto } from '@/hooks/useUser';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import createIcon from '../../assets/images/user-management/Frame_1482_3473.png';
import clearIcon from '../../assets/images/user-management/Frame_1482_3362.png';
import searchIcon from '../../assets/images/user-management/Frame_1482_3486.png';
import saveIcon from '../../assets/images/user-management/Frame_1482_3368.png';
import editIcon from '../../assets/images/user-management/Frame_1482_5074.png';
import deleteIcon from '../../assets/images/user-management/Frame_1482_5077.png';
import firstIcon from '../../assets/images/user-management/Frame_1482_5089.png';
import prevIcon from '../../assets/images/user-management/Frame_1482_5093.png';
import nextIcon from '../../assets/images/user-management/Frame_1482_5109.png';
import lastIcon from '../../assets/images/user-management/Frame_1482_5113.png';

const UserManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // API Hooks
  const { data: usersResponse, isLoading: isLoadingUsers, error: usersError, refetch } = useUsers({
    page: currentPage,
    size: itemsPerPage,
    email: searchName || undefined,
  });
  const users = usersResponse?.content || [];
  const totalPages = usersResponse?.totalPages || 0;
  const totalElements = usersResponse?.totalElements || 0;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    if (usersError) {
      toast.error('Failed to load users');
    }
  }, [usersError]);

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleClear = () => {
    setSearchName('');
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setEditingUserId(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUserId && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      if (editingUserId) {
        const updateData: UpdateUserDto = {
          email,
          fullName,
        };
        await updateUserMutation.mutateAsync({ id: editingUserId, data: updateData });
        toast.success('User updated successfully');
        setIsUserModalOpen(false);
        handleCancel();
      } else {
        const createData: CreateUserDto = {
          email,
          fullName,
          password,
        };
        await createUserMutation.mutateAsync(createData);
        toast.success('User created successfully');
        setIsUserModalOpen(false);
        handleCancel();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(editingUserId ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsUserModalOpen(false);
  };

  const handleEdit = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditingUserId(user.id);
      setFullName(user.fullName);
      setEmail(user.email);
      setPassword('');
      setConfirmPassword('');
      setIsUserModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: () => {
        deleteUserMutation.mutateAsync(id)
          .then(() => {
            toast.success('User deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
          });
      },
    });
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">User Management</h1>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="searchName" className="text-sm font-semibold text-gray-800 dark:text-white">
              Email
            </label>
            <input
              id="searchName"
              type="text"
              placeholder="Enter email to search"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <img src={createIcon} alt="Create" width="16" height="16" />
              {' '}Create
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <img src={clearIcon} alt="Clear" width="16" height="16" />
                {' '}Clear
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
              >
                <img src={searchIcon} alt="Search" width="16" height="16" />
                {' '}Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User List Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">User List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Email
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Full Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Roles
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.email}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.fullName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.roles.join(', ')}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="flex items-center justify-center w-9 h-9 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 hover:scale-110 transition-all p-0 border-none"
                        title="Delete"
                      >
                        <img src={deleteIcon} alt="Delete" width="16" height="16" className="block brightness-0 invert" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="ml-4">Total: {totalElements} items</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={firstIcon} alt="First" width="16" height="16" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={prevIcon} alt="Previous" width="16" height="16" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded text-sm font-semibold cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-500 dark:bg-blue-600 text-white border border-blue-500'
                      : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={nextIcon} alt="Next" width="16" height="16" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={lastIcon} alt="Last" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={handleCancel}
        title={editingUserId ? 'Edit User' : 'Add User'}
        size="lg"
      >
        <form onSubmit={handleSaveUser}>
          <div className="grid grid-cols-1 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!editingUserId}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-semibold text-gray-800 dark:text-white">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {!editingUserId && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              <img src={clearIcon} alt="Cancel" width="16" height="16" />
              {' '}Cancel
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={saveIcon} alt="Save" width="16" height="16" />
              {' '}
              {createUserMutation.isPending || updateUserMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default UserManagement;
