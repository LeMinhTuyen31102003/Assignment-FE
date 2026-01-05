import { useState } from 'react';
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  status: string;
}

const UserManagement = () => {
  const [searchName, setSearchName] = useState('');
  const [statusActive, setStatusActive] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userStatusActive, setUserStatusActive] = useState(false);

  const users: User[] = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@domain.com', userName: 'admin', phoneNumber: '+84987654321', status: 'Yes' },
    { id: 2, firstName: 'Editor', lastName: 'User', email: 'editor@domain.com', userName: 'editor', phoneNumber: '+84987654321', status: 'Yes' },
    { id: 3, firstName: 'Cong', lastName: 'Dinh', email: 'congdinh@domain.com', userName: 'congdinh', phoneNumber: '+84987654321', status: 'Yes' },
    { id: 4, firstName: 'Van', lastName: 'Nguyen', email: 'vannguyen@domain.com', userName: 'vannguyen', phoneNumber: '+84987654321', status: 'Yes' },
  ];

  const handleSearch = () => {
    console.log('Searching...', { searchName, statusActive });
  };

  const handleClear = () => {
    setSearchName('');
    setStatusActive(false);
  };

  const handleCreate = () => {
    console.log('Creating user...');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving user...', { firstName, lastName, email, userName, password, confirmPassword, dateOfBirth, phoneNumber, userStatusActive });
  };

  const handleCancel = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setUserName('');
    setPassword('');
    setConfirmPassword('');
    setDateOfBirth('');
    setPhoneNumber('');
    setUserStatusActive(false);
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">User Management</h1>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="searchName" className="text-sm font-semibold text-gray-800 dark:text-white">
                Name
              </label>
              <input
                id="searchName"
                type="text"
                placeholder="Enter username to search"
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
        <h2 className="text-xl font-bold text-gray-800 mb-5">User List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  First Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Last Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Email
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  User Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 align-middle">
                  Phone Number
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.firstName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.lastName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.email}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.userName}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.phoneNumber}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">{user.status}</td>
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
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={firstIcon} alt="First" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={prevIcon} alt="Previous" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white border border-blue-500 rounded text-sm font-semibold cursor-pointer">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              3
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={nextIcon} alt="Next" width="16" height="16" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-all">
              <img src={lastIcon} alt="Last" width="16" height="16" />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">1-10 of 92</div>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Add User</h2>
        <form onSubmit={handleSaveUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-gray-800 dark:text-white">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-gray-800 dark:text-white">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="userName" className="text-sm font-semibold text-gray-800 dark:text-white">
                User Name
              </label>
              <input
                id="userName"
                type="text"
                placeholder="Enter your user name"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
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
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-800 dark:text-white">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                placeholder="Enter your date of birth"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-800 dark:text-white">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="userStatusActive" className="text-sm font-semibold text-gray-800 dark:text-white">
              Status
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[42px]">
              <input
                type="checkbox"
                id="userStatusActive"
                checked={userStatusActive}
                onChange={(e) => setUserStatusActive(e.target.checked)}
                className="w-4.5 h-4.5 cursor-pointer"
              />
              <label htmlFor="userStatusActive" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                Active
              </label>
            </div>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all"
            >
              <img src={saveIcon} alt="Save" width="16" height="16" />
              {' '}Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
