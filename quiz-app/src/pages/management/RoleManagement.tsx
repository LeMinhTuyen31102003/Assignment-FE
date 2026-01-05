import { useState } from 'react';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
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

interface Role {
  id: number;
  name: string;
  description: string;
  status: string;
}

const RoleManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [statusActive, setStatusActive] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatusActive, setRoleStatusActive] = useState(false);
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const roles: Role[] = [
    { id: 1, name: 'Admin', description: 'Full Access', status: 'Yes' },
    { id: 2, name: 'Editor', description: 'Editable', status: 'Yes' },
    { id: 3, name: 'User', description: 'Customer', status: 'Yes' },
  ];

  const handleSearch = () => {
    console.log('Searching...', { searchName, statusActive });
  };

  const handleClear = () => {
    setSearchName('');
    setStatusActive(false);
  };

  const handleCreate = () => {
    setEditingRoleId(null);
    setRoleName('');
    setRoleDescription('');
    setRoleStatusActive(false);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving role...', { roleName, roleDescription, roleStatusActive });
    setIsRoleModalOpen(false);
    setEditingRoleId(null);
    setRoleName('');
    setRoleDescription('');
    setRoleStatusActive(false);
  };

  const handleCancelRole = () => {
    setIsRoleModalOpen(false);
    setEditingRoleId(null);
    setRoleName('');
    setRoleDescription('');
    setRoleStatusActive(false);
  };

  const handleEdit = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setRoleStatusActive(role.status === 'Yes');
    setIsRoleModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Role',
      message: `Are you sure you want to delete role "${role.name}"? This action cannot be undone.`,
      onConfirm: () => {
        console.log('Delete:', role.id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Role Management</h1>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="searchName" className="text-sm font-semibold text-gray-800 dark:text-white">
                Name
              </label>
              <input
                id="searchName"
                type="text"
                placeholder="Enter role name to search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="statusActive" className="text-sm font-semibold text-gray-800 dark:text-white">
                Status
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
                <input
                  type="checkbox"
                  id="statusActive"
                  checked={statusActive}
                  onChange={(e) => setStatusActive(e.target.checked)}
                  className="w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="statusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                  Active
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <img src={createIcon} alt="Create" width="16" height="16" />
              {' '}Create
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <img src={clearIcon} alt="Clear" width="16" height="16" />
                {' '}Clear
              </button>
              <button
                type="button"
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

      {/* Role List Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Role List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{role.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{role.description}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{role.status}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => handleEdit(role)}
                        className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 hover:scale-110 hover:shadow-md transition-all p-0 border-none"
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" width="16" height="16" className="block brightness-0 invert" />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
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
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="ml-4">Total: 32 items</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
              <img src={firstIcon} alt="First" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
              <img src={prevIcon} alt="Previous" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white border border-blue-500 rounded cursor-pointer hover:bg-blue-600 transition-all font-semibold text-sm">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-semibold text-sm">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-semibold text-sm">
              3
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
              <img src={nextIcon} alt="Next" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
              <img src={lastIcon} alt="Last" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>

      {/* Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={handleCancelRole}
        title={editingRoleId ? 'Edit Role' : 'Add Role'}
        size="lg"
      >
        <form onSubmit={handleSaveRole}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="roleName" className="text-sm font-semibold text-gray-800 dark:text-white">
                Name
              </label>
              <input
                id="roleName"
                type="text"
                placeholder="Enter role name"
                required
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="roleDescription" className="text-sm font-semibold text-gray-800 dark:text-white">
                Description
              </label>
              <input
                id="roleDescription"
                type="text"
                placeholder="Enter role description"
                required
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="roleStatusActive" className="text-sm font-semibold text-gray-800 dark:text-white">
              Status
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
              <input
                type="checkbox"
                id="roleStatusActive"
                checked={roleStatusActive}
                onChange={(e) => setRoleStatusActive(e.target.checked)}
                className="w-4.5 h-4.5 cursor-pointer"
              />
              <label htmlFor="roleStatusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                Active
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelRole}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              <img src={clearIcon} alt="Cancel" width="16" height="16" />
              {' '}
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
            >
              <img src={saveIcon} alt="Save" width="16" height="16" />
              {' '}
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default RoleManagement;
